.PHONY: help install dev build package lint lint-fix format format-check type-check clean pre-commit

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

dev: ## Start development server
	pnpm dev

build: ## Build for production
	pnpm build

package: ## Package extension
	pnpm package

lint: ## Run ESLint
	pnpm lint

lint-fix: ## Fix ESLint issues automatically
	pnpm lint:fix

format: ## Format code with Prettier
	pnpm prettier

format-check: ## Check code formatting
	pnpm prettier:check

type-check: ## Run TypeScript type checking
	pnpm type-check

clean: ## Clean build artifacts
	rm -rf build/
	rm -rf .plasmo/

check: lint format-check type-check ## Run all checks (lint, format, type-check)

fix: lint-fix format ## Fix all issues (lint and format)

pre-commit: ## Run pre-commit hooks
	pre-commit run --all-files
