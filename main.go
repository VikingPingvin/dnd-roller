package main

import (
	"crypto/rand"
	"fmt"
	"html/template"
	"log"
	"math/big"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

type DiceRoll struct {
	Input   string `json:"input"`
	Result  int    `json:"result"`
	Details string `json:"details"`
	Error   string `json:"error,omitempty"`
}

type DiceSet struct {
	Count    int
	Sides    int
	Modifier int
}

func main() {
	http.HandleFunc("/", handleHome)
	http.HandleFunc("/roll", handleRoll)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	fmt.Println("🎲 D&D Dice Roller starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/index.html"))
	tmpl.Execute(w, nil)
}

func handleRoll(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	input := strings.TrimSpace(r.FormValue("dice"))
	if input == "" {
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, `<div class="text-red-500">Please enter dice notation</div>`)
		return
	}

	roll := rollDice(input)

	w.Header().Set("Content-Type", "text/html")
	if roll.Error != "" {
		fmt.Fprintf(w, `<div class="text-red-500">Error: %s</div>`, roll.Error)
	} else {
		fmt.Fprintf(w, `
			<div class="bg-green-50 border border-green-200 rounded-lg p-4">
				<div class="text-2xl font-bold text-green-800">%d</div>
				<div class="text-sm text-green-600 mt-1">%s</div>
				<div class="text-xs text-gray-500 mt-1">Input: %s</div>
			</div>
		`, roll.Result, roll.Details, roll.Input)
	}
}

func rollDice(input string) DiceRoll {
	roll := DiceRoll{Input: input}

	// Parse dice notation and modifiers
	diceRe := regexp.MustCompile(`(\d+)d(\d+)`)
	diceMatches := diceRe.FindAllStringSubmatch(input, -1)

	if len(diceMatches) == 0 {
		roll.Error = "Invalid dice notation. Use format like '1d6', '2d8+3', or '1d20+2d6'"
		return roll
	}

	totalResult := 0
	var details []string

	// Process each dice group
	for _, match := range diceMatches {
		count, _ := strconv.Atoi(match[1])
		sides, _ := strconv.Atoi(match[2])

		if count <= 0 || count > 100 {
			roll.Error = "Dice count must be between 1 and 100"
			return roll
		}
		if sides <= 0 || sides > 1000 {
			roll.Error = "Dice sides must be between 1 and 1000"
			return roll
		}

		// Roll the dice
		var rolls []int
		subtotal := 0
		for i := 0; i < count; i++ {
			result := rollSingleDie(sides)
			rolls = append(rolls, result)
			subtotal += result
		}

		rollsStr := strings.Trim(strings.Join(strings.Fields(fmt.Sprint(rolls)), ", "), "[]")
		if count == 1 {
			details = append(details, fmt.Sprintf("%dd%d: %d", count, sides, subtotal))
		} else {
			details = append(details, fmt.Sprintf("%dd%d: [%s] = %d", count, sides, rollsStr, subtotal))
		}

		totalResult += subtotal
	}

	// Handle modifiers (simple approach: find all +/- numbers not preceded by 'd')
	modRe := regexp.MustCompile(`[+-]\d+`)
	allMods := modRe.FindAllString(input, -1)

	for _, mod := range allMods {
		// Simple check: if the modifier position in string is not right after a 'd', it's a standalone modifier
		modPos := strings.Index(input, mod)
		if modPos > 0 && input[modPos-1] != 'd' {
			modifier, _ := strconv.Atoi(mod)
			totalResult += modifier
			if modifier > 0 {
				details = append(details, fmt.Sprintf("(+%d)", modifier))
			} else {
				details = append(details, fmt.Sprintf("(%d)", modifier))
			}
		}
	}

	roll.Result = totalResult
	roll.Details = strings.Join(details, " ")
	return roll
}

func rollSingleDie(sides int) int {
	n, err := rand.Int(rand.Reader, big.NewInt(int64(sides)))
	if err != nil {
		return 1
	}
	return int(n.Int64()) + 1
}
