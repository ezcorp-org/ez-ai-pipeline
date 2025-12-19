# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added

- Initial release of EZ AI Pipeline
- Multi-stage pipeline execution engine
- Support for Anthropic Claude models
- Beautiful terminal UI with progress indicators
- Pipeline validation and schema enforcement
- Variable interpolation between stages
- Conditional stage execution (skipIf, runIf, earlyExit)
- Cost tracking and token counting
- JSON, Markdown, and text output parsing
- Pipeline pause/resume/cancel functionality
- Example prompt-optimizer pipeline

### Commands

- `run` - Execute a pipeline with input
- `list` - List available pipelines
- `validate` - Validate pipeline configuration
- `init` - Create new pipeline from template

### Supported Models

- Anthropic: claude-opus-4-5, claude-sonnet-4-5, claude-haiku-4-5
- OpenAI: gpt-4o, gpt-4o-mini, gpt-4-turbo
- Google: gemini-1.5-pro, gemini-1.5-flash, gemini-2.0-flash
