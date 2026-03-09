# 🚀 Contributing to ArogyaMitra

Thank you for your interest in contributing to ArogyaMitra!

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/arogyamitra.git
   cd arogyamitra
   ```

3. **Set up the development environment:**

   **Backend:**
   ```powershell
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

   **Frontend:**
   ```powershell
   cd frontend
   npm install
   ```

4. **Run the development servers:**
   ```powershell
   .\run aromi
   ```

## Development Guidelines

### Code Style
- **Python**: Follow PEP 8 guidelines
- **TypeScript/React**: Follow ESLint rules (run `npm run lint`)
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Follow conventional commits format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:
```
feat: add workout history filtering
fix: resolve token expiration issue
docs: update setup instructions
```

### Pull Request Process

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request on GitHub with:
   - Clear title and description
   - Screenshots (if UI changes)
   - Testing instructions

### What to Contribute

**Good First Issues:**
- 🐛 Bug fixes
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ✅ Adding tests
- 🌐 Internationalization (i18n)

**Feature Ideas:**
- Social features (share workouts, follow friends)
- More AI models integration
- Workout video tutorials
- Nutrition tracking with barcode scanner
- Wearable device integration

## Testing

Before submitting:
- ✅ Test your changes locally
- ✅ Ensure no console errors
- ✅ Run `python check_setup.py` to verify setup
- ✅ Check that both frontend and backend work

## Need Help?

- 📖 Read the [README.md](README.md)
- 🛠️ Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 💬 Open an issue for questions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

Thank you for contributing! 🙏
