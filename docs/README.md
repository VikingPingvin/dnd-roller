# D&D Dice Roller - Client-Side Version

A pure JavaScript implementation of the D&D dice roller that runs entirely in the browser - perfect for GitHub Pages hosting!

## ✅ GitHub Pages Ready

This version has been converted from the Go backend to pure client-side JavaScript, making it compatible with GitHub Pages static hosting.

## 🎲 Features

- **Complex dice notation support**: `1d20`, `2d6+3`, `3d6+1d8+2`, etc.
- **Cryptographically secure random numbers**: Uses `crypto.getRandomValues()`
- **No backend required**: Runs entirely in the browser
- **Mobile responsive**: Beautiful Tailwind CSS design
- **Real-time validation**: Instant error feedback
- **Quick examples**: One-click common dice rolls

## 🚀 Deployment to GitHub Pages

1. **Upload files to your GitHub repository**:
   ```
   your-repo/
   ├── index.html
   ├── diceRoller.js
   └── README.md
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select source branch (usually `main`)
   - Your app will be available at: `https://yourusername.github.io/your-repo`

3. **That's it!** No build process, no server setup required.

## 📁 File Structure

- `index.html` - Main HTML page with Tailwind CSS styling
- `diceRoller.js` - Pure JavaScript dice rolling logic (converted from Go)
- `README.md` - This documentation

## 🎮 Supported Dice Notation

| Format | Description | Example |
|--------|-------------|---------|
| `XdY` | X dice of Y sides | `1d20`, `4d6` |
| `XdY+Z` | X dice of Y sides plus modifier | `1d20+5`, `2d6+3` |
| `XdY-Z` | X dice of Y sides minus modifier | `1d20-2` |
| Complex | Multiple dice types | `3d6+1d8+2` |

## 🔧 Technical Details

### Converted from Go to JavaScript:
- **Regex parsing**: Dice notation parsing using JavaScript RegExp
- **Secure randomness**: `crypto.getRandomValues()` instead of Go's `crypto/rand`
- **Error handling**: Client-side validation and error display
- **No dependencies**: Pure JavaScript (except Tailwind CSS from CDN)

### Key Improvements for Client-Side:
- **No HTMX dependency**: Pure JavaScript form handling
- **Instant results**: No network requests, immediate response
- **Offline capable**: Works without internet after initial load
- **SEO friendly**: Static HTML content

## 🌟 Advantages Over Server Version

✅ **Free hosting** on GitHub Pages  
✅ **No server costs** or maintenance  
✅ **Instant loading** - no API calls  
✅ **Works offline** after initial load  
✅ **Easy deployment** - just upload files  
✅ **Global CDN** via GitHub Pages  

## 🎯 Perfect For

- Personal D&D campaigns
- Quick dice rolling tool
- Learning JavaScript/web development
- GitHub Pages portfolio projects
- Offline gaming scenarios

---

*Original Go version available in parent directory for local development with hot reload.*