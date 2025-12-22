#!/bin/bash

# E2E Test Runner for ezAiPipeline Web Interface
# Usage: ./web/tests/run-tests.sh [port]

PORT=${1:-3130}
export TEST_URL="http://localhost:$PORT"

echo "🧪 Running E2E Tests against $TEST_URL"
echo "================================================"

# Check if server is running
if ! curl -s "$TEST_URL/api/pipelines" > /dev/null 2>&1; then
    echo "❌ Server not running at $TEST_URL"
    echo "   Start it with: PORT=$PORT bun run web/index.ts"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Run all tests
echo "📋 Running API Tests..."
bun test web/tests/api.test.ts

echo ""
echo "📋 Running UI Tests..."
bun test web/tests/ui.test.ts

echo ""
echo "📋 Running Browser Test Validation..."
bun test web/tests/browser.test.ts

echo ""
echo "================================================"
echo "✅ All E2E tests completed!"
