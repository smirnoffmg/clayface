# Clayface Refactoring TODO

## Overview

This document outlines the step-by-step refactoring plan for the Clayface browser extension, following SOLID, DRY, KISS, and YAGNI principles.

## Phase 1: Foundation Setup

### 1.1 Configure Path Aliases

- [x] Update `tsconfig.json` to add `@src/` path alias (replace existing `~*` alias)
- [x] Test that `@src/` imports work correctly
- [x] Update existing imports to use `@src/` where appropriate
- [x] Remove old `~*` path alias configuration

### 1.0 Remove LangChain Dependencies

- [x] Remove LangChain dependencies from `package.json`
- [x] Create simplified Claude API service without LangChain
- [x] Update popup component to use simplified API
- [x] Test that extension builds and works without module resolution errors
- [x] Verify all functionality is preserved (CV adaptation, cover letter generation)

### 1.2 Create Folder Structure

- [ ] Create `src/` directory
- [ ] Create `src/components/` directory
- [ ] Create `src/components/ui/` directory
- [ ] Create `src/components/popup/` directory
- [ ] Create `src/components/layout/` directory
- [ ] Create `src/services/` directory
- [ ] Create `src/services/api/` directory
- [ ] Create `src/services/storage/` directory
- [ ] Create `src/services/file/` directory
- [ ] Create `src/types/` directory
- [ ] Create `src/utils/` directory
- [ ] Create `src/hooks/` directory
- [ ] Create `src/content/` directory
- [ ] Create `src/__tests__/` directory for test files

### 1.3 Extract TypeScript Interfaces

- [ ] Create `src/types/common.ts` with shared interfaces
- [ ] Create `src/types/api.ts` with API-related interfaces
- [ ] Create `src/types/popup.ts` with popup-specific interfaces
- [ ] Move interfaces from `popup.tsx` to appropriate type files
- [ ] Move interfaces from `claude-api.ts` to appropriate type files
- [ ] Update imports to use new type files

### 1.4 Create Constants File

- [ ] Create `src/utils/constants.ts`
- [ ] Extract hardcoded values from `popup.tsx`
- [ ] Extract hardcoded values from `claude-api.ts`
- [ ] Update code to use constants
- [ ] Write tests for constants validation

### 1.5 Update Plasmo Configuration

- [ ] Verify Plasmo can find files in new src/ structure
- [ ] Update entry point configuration if needed
- [ ] Test build process with new structure
- [ ] Ensure content script still loads correctly

### 1.6 Add Chrome Extension Types

- [ ] Create `src/types/chrome.ts` with Chrome API types
- [ ] Add Plasmo-specific type definitions
- [ ] Update imports to use proper Chrome types
- [ ] Add type definitions for content script communication

## Phase 2: Service Layer Refactoring (TDD Approach)

### 2.1 Refactor Claude API Service

- [ ] Write tests for Claude API service functionality
- [ ] Write tests for error handling scenarios
- [ ] Write tests for retry logic
- [ ] Move `claude-api.ts` to `src/services/api/claude-api.ts`
- [ ] Extract error handling into separate utility
- [ ] Add proper TypeScript types
- [ ] Improve error messages and handling
- [ ] Add retry logic for failed requests
- [ ] Run tests to ensure all functionality works

### 2.2 Create Storage Service

- [ ] Write tests for Chrome storage operations
- [ ] Write tests for storage error handling
- [ ] Create `src/services/storage/chrome-storage.ts`
- [ ] Extract Chrome storage operations from `popup.tsx`
- [ ] Add proper error handling for storage operations
- [ ] Add TypeScript types for storage data
- [ ] Run tests to ensure storage service works correctly

### 2.3 Create File Handler Service

- [ ] Write tests for file upload functionality
- [ ] Write tests for file validation
- [ ] Write tests for PDF parsing
- [ ] Write tests for file error handling
- [ ] Create `src/services/file/file-handler.ts`
- [ ] Extract file upload logic from `popup.tsx`
- [ ] Add proper file validation
- [ ] Add PDF parsing utilities
- [ ] Add error handling for file operations
- [ ] Run tests to ensure file handler works correctly

## Phase 3: Custom Hooks (TDD Approach)

### 3.1 Create API Key Hook

- [ ] Write tests for API key management functionality
- [ ] Write tests for API key validation
- [ ] Write tests for loading states
- [ ] Write tests for error handling
- [ ] Create `src/hooks/useApiKey.ts`
- [ ] Extract API key management logic from `popup.tsx`
- [ ] Add proper error handling
- [ ] Add loading states
- [ ] Run tests to ensure hook works correctly

### 3.2 Create Page Info Hook

- [ ] Write tests for page info extraction
- [ ] Write tests for content script communication
- [ ] Write tests for error handling
- [ ] Write tests for loading states
- [ ] Create `src/hooks/usePageInfo.ts`
- [ ] Extract page info logic from `popup.tsx`
- [ ] Add proper error handling
- [ ] Add loading states
- [ ] Run tests to ensure hook works correctly

### 3.3 Create File Upload Hook

- [ ] Write tests for file upload functionality
- [ ] Write tests for file validation
- [ ] Write tests for progress tracking
- [ ] Write tests for error handling
- [ ] Create `src/hooks/useFileUpload.ts`
- [ ] Extract file upload logic from `popup.tsx`
- [ ] Add proper validation
- [ ] Add progress tracking
- [ ] Run tests to ensure hook works correctly

## Phase 4: UI Components (TDD Approach)

### 4.1 Create Reusable UI Components

- [ ] Write tests for Button component functionality
- [ ] Write tests for Input component functionality
- [ ] Write tests for FileUpload component functionality
- [ ] Write tests for StatusMessage component functionality
- [ ] Create `src/components/ui/Button.tsx`
- [ ] Create `src/components/ui/Input.tsx`
- [ ] Create `src/components/ui/FileUpload.tsx`
- [ ] Create `src/components/ui/StatusMessage.tsx`
- [ ] Add proper TypeScript props
- [ ] Add basic styling
- [ ] Run tests to ensure all components work correctly

### 4.2 Create Popup-Specific Components

- [ ] Write tests for ApiKeyInput component functionality
- [ ] Write tests for CvUpload component functionality
- [ ] Write tests for ResultsDisplay component functionality
- [ ] Write tests for PageInfo component functionality
- [ ] Create `src/components/popup/ApiKeyInput.tsx`
- [ ] Create `src/components/popup/CvUpload.tsx`
- [ ] Create `src/components/popup/ResultsDisplay.tsx`
- [ ] Create `src/components/popup/PageInfo.tsx`
- [ ] Add proper TypeScript props
- [ ] Use custom hooks for logic
- [ ] Run tests to ensure all components work correctly

### 4.3 Create Layout Component

- [ ] Write tests for PopupLayout component functionality
- [ ] Write tests for layout responsiveness
- [ ] Create `src/components/layout/PopupLayout.tsx`
- [ ] Extract layout logic from `popup.tsx`
- [ ] Add proper TypeScript props
- [ ] Run tests to ensure layout component works correctly

## Phase 5: Main Popup Refactoring (TDD Approach)

### 5.1 Break Down Main Component

- [ ] Write tests for main popup functionality
- [ ] Write tests for component integration
- [ ] Write tests for state management
- [ ] Move `popup.tsx` to `src/components/popup/Popup.tsx`
- [ ] Replace inline components with extracted components
- [ ] Use custom hooks for state management
- [ ] Remove business logic from component
- [ ] Run tests to ensure refactored popup works correctly

### 5.2 Update Entry Point

- [ ] Write tests for entry point functionality
- [ ] Update `popup.tsx` to import from new location
- [ ] Run tests to ensure popup still works correctly
- [ ] Verify all functionality is preserved

### 5.3 Verify Extension Build

- [ ] Test that extension builds correctly with new structure
- [ ] Verify content script communication still works
- [ ] Test extension loading in Chrome
- [ ] Verify Plasmo build process works with new file structure
- [ ] Test hot reload during development

## Phase 6: Content Script Refactoring (TDD Approach)

### 6.1 Move Content Script

- [ ] Write tests for content script functionality
- [ ] Write tests for page content extraction
- [ ] Write tests for message handling
- [ ] Move `content.ts` to `src/content/content.ts`
- [ ] Add proper TypeScript types
- [ ] Improve error handling
- [ ] Run tests to ensure content script works correctly
- [ ] Verify Plasmo content script configuration
- [ ] Test content script injection on different page types

## Phase 7: Error Handling & UX

### 7.1 Add Error Boundaries

- [ ] Create `src/components/ErrorBoundary.tsx`
- [ ] Wrap main popup component
- [ ] Add fallback UI for errors
- [ ] Test error boundary

### 7.2 Improve Error Handling

- [ ] Add comprehensive error messages
- [ ] Add retry mechanisms
- [ ] Add user-friendly error states
- [ ] Test error scenarios
- [ ] Add Chrome extension-specific error handling
- [ ] Handle content script communication errors
- [ ] Add API rate limiting error handling

### 7.3 Improve Loading States

- [ ] Add loading indicators for all async operations
- [ ] Add skeleton loading states
- [ ] Improve user feedback
- [ ] Test loading states

## Phase 8: Styling & Polish

### 8.1 Replace Inline Styles

- [ ] Create `src/styles/` directory
- [ ] Create CSS modules for components
- [ ] Replace inline styles with CSS modules
- [ ] Add responsive design
- [ ] Test styling across different screen sizes

### 8.2 Add Animations

- [ ] Add smooth transitions
- [ ] Add loading animations
- [ ] Add success/error animations
- [ ] Test animations

## Phase 9: Testing Setup & Integration

### 9.1 Set Up Testing Framework

- [ ] Set up Jest testing framework
- [ ] Configure Jest environment for Chrome extension
- [ ] Set up mock for Chrome APIs
- [ ] Add Jest dependencies to package.json
- [ ] Add `make test` command to Makefile
- [ ] Add `make test:watch` command for development
- [ ] Add `make test:coverage` command for coverage reports

### 9.2 Add Integration Tests

- [ ] Test popup functionality end-to-end
- [ ] Test API integration
- [ ] Test file upload flow
- [ ] Test error scenarios
- [ ] Test content script integration
- [ ] Test Chrome extension loading and functionality
- [ ] Test Plasmo build and development workflow
- [ ] Add `make test:integration` command to Makefile
- [ ] Add `make test:e2e` command for end-to-end testing

## Phase 10: Documentation & Cleanup

### 10.1 Add Documentation

- [ ] Add JSDoc comments to functions
- [ ] Add README for each major component
- [ ] Add usage examples
- [ ] Update main README
- [ ] Document Chrome extension architecture
- [ ] Document Plasmo-specific configuration
- [ ] Add troubleshooting guide for common issues

### 10.2 Code Cleanup

- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Fix linting issues
- [ ] Run final code review
- [ ] Run `make check` to ensure all quality checks pass
- [ ] Run `make fix` to automatically fix any remaining issues

## Success Criteria

- [ ] All components follow Single Responsibility Principle
- [ ] Code is properly organized and maintainable
- [ ] All functionality is preserved
- [ ] Tests pass
- [ ] Linting passes
- [ ] TypeScript compilation succeeds
- [ ] Extension works correctly in browser
- [ ] Plasmo build process works correctly
- [ ] Content script communication functions properly
- [ ] Chrome extension loads and functions in browser
- [ ] Development workflow (hot reload) works correctly

## Notes

- **Follow TDD: Write tests first, then implement functionality**
- **Use `@src/` path alias for all imports** (not `~*`)
- **Use Jest for testing framework**
- Run `make check` (lint, format-check, type-check) after each step
- Use `make fix` to automatically fix linting and formatting issues
- Run `make test` after each implementation to ensure tests pass
- Test functionality after each major change
- Commit changes frequently with descriptive messages
- If a step seems too large, break it down further
- Focus on maintaining functionality while improving structure
- Test Plasmo build process after file moves
- Verify Chrome extension functionality after each phase
- Test content script communication after refactoring
- Ensure hot reload works during development
- Use `make dev` for development and `make build` for production builds
