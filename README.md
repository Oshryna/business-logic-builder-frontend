# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Business Logic Builder

## Project Summary & Architecture

This project is a modular, scalable React application for building and visualizing business logic rules. It follows best practices for maintainability, testability, and UI/UX using Material UI and a component-driven architecture.

### Key Features

- **Modular Components:** Large components (e.g., RuleBuilder, LogicTreeView, RuleList) are split into smaller, reusable components (Condition, ConditionGroup, etc.).
- **Best Practices:** Code follows React and Material UI conventions, with clear separation of concerns, hooks for state, and styled components for UI consistency.
- **Testing:** Comprehensive unit and integration tests are provided for all major components using React Testing Library and Jest.
- **Performance & Maintainability:** Components are optimized for performance and easy to extend or refactor.

### Main Components

- `RuleBuilder`: Orchestrates the rule creation UI, validation, and state.
- `ConditionGroup`: Handles groups of conditions (AND/OR/NOT) and nesting.
- `Condition`: Handles a single condition row.
- `LogicTreeView`: Visualizes the business logic tree structure.
- `RuleList`: Displays, filters, and manages saved rules.

### Directory Structure

```
/src
  /components
    Condition.js
    ConditionGroup.js
    RuleBuilder.js
    LogicTreeView.js
    RuleList.js
    ...
  /tests
    (unit/integration tests for all major components)
```

### Best Practices Followed

- Modular, reusable components
- Consistent naming and code style
- Robust error handling and input validation
- Responsive, accessible UI with Material UI
- Clear documentation and code comments
- Comprehensive test coverage

### Running Tests

To run all unit and integration tests:

```
npm test
```

Tests are located alongside their respective components or in a `/tests` directory. They cover rendering, user interaction, validation, and callback logic for all major UI elements.

### Further Development

- Follow the same modular and test-driven approach for any new features.
- See code comments and this README for guidance on extending or maintaining the codebase.

---
