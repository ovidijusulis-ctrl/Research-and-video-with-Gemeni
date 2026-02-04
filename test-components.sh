#!/bin/bash
# Ovi English School - Component Test Script
# Run this on your Mac to verify each part works

cd "$(dirname "$0")"

echo "═══════════════════════════════════════════════════"
echo "🔍 OVI ENGLISH SCHOOL - Component Tests"
echo "═══════════════════════════════════════════════════"
echo ""

# Test 1: Network & News
echo "┌─ TEST 1: News Fetcher"
echo "   Testing network access to BBC..."
if curl -s --max-time 5 "https://feeds.bbci.co.uk/news/world/rss.xml" > /dev/null 2>&1; then
    echo "   ✅ Network works - can reach BBC"
else
    echo "   ❌ Network issue - cannot reach BBC"
fi

# Test 2: Z.ai API (Primary)
echo ""
echo "┌─ TEST 2: Z.ai API (Primary LLM)"
source .env 2>/dev/null
if [ -z "$ZAI_API_KEY" ]; then
    echo "   ⚠️  No ZAI_API_KEY in .env"
    echo "   Get one at: https://z.ai/developer"
else
    echo "   Testing API key..."
    response=$(curl -s -w "\n%{http_code}" \
        -H "Authorization: Bearer $ZAI_API_KEY" \
        "https://api.z.ai/api/paas/v4/models")
    http_code=$(echo "$response" | tail -1)
    if [ "$http_code" = "200" ]; then
        echo "   ✅ Z.ai API key works"
    else
        echo "   ❌ Z.ai API returned: $http_code"
    fi
fi

# Test 3: Gemini API (Fallback)
echo ""
echo "┌─ TEST 3: Gemini API (Fallback LLM)"
if [ -z "$GEMINI_API_KEY" ]; then
    echo "   ⚠️  No GEMINI_API_KEY in .env (optional fallback)"
else
    echo "   Testing API key..."
    response=$(curl -s -w "\n%{http_code}" \
        "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY")
    http_code=$(echo "$response" | tail -1)
    if [ "$http_code" = "200" ]; then
        echo "   ✅ Gemini API key works"
    else
        echo "   ⚠️  Gemini API returned: $http_code (will use Z.ai instead)"
    fi
fi

# Test 4: Qwen3-TTS
echo ""
echo "┌─ TEST 4: Qwen3-TTS"
if [ -d "$HOME/qwen3-tts" ]; then
    echo "   ✅ Found at ~/qwen3-tts"
    if [ -f "$HOME/qwen3-tts/.venv/bin/python" ]; then
        echo "   ✅ Virtual environment exists"
    else
        echo "   ⚠️  No .venv found - run: cd ~/qwen3-tts && python -m venv .venv"
    fi
else
    echo "   ❌ Not found at ~/qwen3-tts"
fi

# Test 5: FFmpeg
echo ""
echo "┌─ TEST 5: FFmpeg"
if command -v ffmpeg &> /dev/null; then
    echo "   ✅ FFmpeg installed"
else
    echo "   ❌ FFmpeg not found - run: brew install ffmpeg"
fi

# Test 6: YouTube Token
echo ""
echo "┌─ TEST 6: YouTube OAuth"
if [ -f "youtube_token.json" ]; then
    echo "   ✅ youtube_token.json exists"
else
    echo "   ❌ No youtube_token.json - run: node src/youtube-uploader.js"
fi

# Test 7: Quick TTS test
echo ""
echo "┌─ TEST 7: Quick TTS Generation"
echo "   Creating test audio (5 seconds)..."

TEST_TEXT="Hello, this is a test from Ovi English School. If you hear this clearly, the audio system works perfectly."
echo "$TEST_TEXT" > /tmp/tts-test.txt

if [ -d "$HOME/qwen3-tts" ] && [ -f "$HOME/qwen3-tts/.venv/bin/python" ]; then
    cd "$HOME/qwen3-tts"
    source .venv/bin/activate
    python -c "
from mlx_audio.tts import generate
generate(
    text='$TEST_TEXT',
    output='$HOME/Downloads/tts-test-output.wav',
    model='mlx-community/Qwen3-TTS-12Hz-0.6B-Base-8bit',
    voice='Vivian',
    speed=0.9
)
print('   ✅ Audio generated: ~/Downloads/tts-test-output.wav')
print('   🎧 Play it with: afplay ~/Downloads/tts-test-output.wav')
" 2>&1 | grep -E "(✅|❌|Error)"
    deactivate
    cd - > /dev/null
else
    echo "   ⚠️  Skipping - Qwen3-TTS not set up"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "📋 Summary: Fix any ❌ items above, then run: npm start"
echo "═══════════════════════════════════════════════════"
