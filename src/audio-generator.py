#!/usr/bin/env python3
"""
Audio Generator for Ovi English School
Uses Qwen3-TTS via MLX for high-quality local voice synthesis

Voices: Vivian (default), Chelsie, Ethan
Runs locally on Apple Silicon - no cloud costs!
"""

import subprocess
import os
import sys
import json
import shutil
from pathlib import Path
from datetime import datetime

# Qwen3-TTS Configuration
QWEN_DIR = Path.home() / "qwen3-tts"
QWEN_VENV = QWEN_DIR / ".venv" / "bin" / "python"
QWEN_OUTPUT = QWEN_DIR / "out"
MODEL = "mlx-community/Qwen3-TTS-12Hz-0.6B-Base-8bit"

# Voice presets for different content types
VOICE_PRESETS = {
    "beginner": {
        "voice": "Vivian",
        "speed": 0.85,
        "exaggeration": 0.2,
        "instruct": "clear, calm, friendly teacher, gentle pace, encouraging tone",
        "lang": "en"
    },
    "intermediate": {
        "voice": "Vivian",
        "speed": 0.95,
        "exaggeration": 0.3,
        "instruct": "clear, confident narrator, natural conversational pace",
        "lang": "en"
    },
    "advanced": {
        "voice": "Ethan",
        "speed": 1.0,
        "exaggeration": 0.3,
        "instruct": "professional news anchor, articulate, engaging",
        "lang": "en"
    },
    "spanish": {
        "voice": "Vivian",
        "speed": 0.9,
        "exaggeration": 0.25,
        "instruct": "native Spanish speaker, warm, educational",
        "lang": "es"
    }
}


def check_qwen_installed():
    """Verify Qwen3-TTS is installed"""
    if not QWEN_VENV.exists():
        print(f"❌ Qwen3-TTS not found at {QWEN_DIR}")
        print("   Please ensure it's installed per the documentation")
        return False
    return True


def generate_audio(text, output_path, preset="beginner", file_prefix="episode"):
    """
    Generate audio using Qwen3-TTS
    """
    if not check_qwen_installed():
        return None

    config = VOICE_PRESETS.get(preset, VOICE_PRESETS["beginner"])
    QWEN_OUTPUT.mkdir(parents=True, exist_ok=True)

    cmd = [
        str(QWEN_VENV),
        "-m", "mlx_audio.tts.generate",
        "--model", MODEL,
        "--text", text,
        "--output_path", str(QWEN_OUTPUT),
        "--file_prefix", file_prefix,
        "--audio_format", "wav",
        "--voice", config["voice"],
        "--speed", str(config["speed"]),
        "--exaggeration", str(config["exaggeration"]),
        "--instruct", config["instruct"],
        "--lang_code", config["lang"]
    ]

    print(f"\n🎙️  Generating audio with Qwen3-TTS...")
    print(f"   Voice: {config['voice']}")
    print(f"   Preset: {preset}")
    print(f"   Speed: {config['speed']}")
    print(f"   Text length: {len(text)} chars")

    try:
        result = subprocess.run(
            cmd,
            cwd=str(QWEN_DIR),
            capture_output=True,
            text=True,
            timeout=600  # 10 minutes for longer texts
        )

        if result.returncode != 0:
            print(f"❌ Generation failed: {result.stderr}")
            return None

        # Find all generated chunk files
        chunk_files = sorted(QWEN_OUTPUT.glob(f"{file_prefix}_*.wav"))
        if not chunk_files:
            print(f"❌ No output files found matching {file_prefix}_*.wav")
            return None

        print(f"   Found {len(chunk_files)} audio chunk(s)")

        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Combine chunks if multiple files
        if len(chunk_files) == 1:
            combined_wav = chunk_files[0]
        else:
            # Create concat list file
            concat_list = QWEN_OUTPUT / f"{file_prefix}_concat.txt"
            with open(concat_list, 'w') as f:
                for chunk in chunk_files:
                    f.write(f"file '{chunk}'\n")

            combined_wav = QWEN_OUTPUT / f"{file_prefix}_combined.wav"
            concat_cmd = [
                "ffmpeg", "-y", "-f", "concat", "-safe", "0",
                "-i", str(concat_list), "-c", "copy", str(combined_wav)
            ]
            subprocess.run(concat_cmd, capture_output=True)
            concat_list.unlink()

            # Clean up chunk files
            for chunk in chunk_files:
                chunk.unlink()

        # Convert to mp3 if needed
        if str(output_path).endswith('.mp3'):
            mp3_cmd = [
                "ffmpeg", "-y", "-i", str(combined_wav),
                "-codec:a", "libmp3lame", "-qscale:a", "2",
                str(output_path)
            ]
            subprocess.run(mp3_cmd, capture_output=True)
            combined_wav.unlink()
        else:
            shutil.move(str(combined_wav), str(output_path))

        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"✅ Audio saved: {output_path} ({size_mb:.2f} MB)")
        return str(output_path)

    except subprocess.TimeoutExpired:
        print("❌ Generation timed out")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def generate_episode(script, output_dir, level='beginner', language='english'):
    """Generate all audio files for an episode"""
    os.makedirs(output_dir, exist_ok=True)

    preset = level if language == 'english' else language
    date_str = datetime.now().strftime('%Y-%m-%d')

    # Main episode
    main_file = os.path.join(output_dir, f"ovi-english-{level}-{date_str}.mp3")
    generate_audio(script, main_file, preset=preset, file_prefix=f"ovi-{level}")

    # Slow version for beginners
    if level == 'beginner':
        slow_config = VOICE_PRESETS["beginner"].copy()
        slow_config["speed"] = 0.7
        VOICE_PRESETS["beginner_slow"] = slow_config

        slow_file = os.path.join(output_dir, f"ovi-english-{level}-slow-{date_str}.mp3")
        generate_audio(script, slow_file, preset="beginner_slow", file_prefix=f"ovi-{level}-slow")

    return main_file


def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == '--test':
        print("🧪 Running test generation...")
        test_text = """
        Welcome to Ovi English School! Today we're learning with real news.
        Let's start with our vocabulary. The word is remarkable.
        It means very unusual or surprising.
        """
        result = generate_audio(test_text.strip(), "test_output.mp3", preset="beginner")
        if result:
            print(f"\n🎧 Test complete! Play with: afplay {result}")
        return

    if len(sys.argv) > 1 and sys.argv[1] != '--test':
        script_path = sys.argv[1]
        with open(script_path, 'r') as f:
            script = f.read()
        output_dir = sys.argv[2] if len(sys.argv) > 2 else './output'
        level = sys.argv[3] if len(sys.argv) > 3 else 'beginner'
        generate_episode(script, output_dir, level)
        return
    elif not sys.stdin.isatty():
        data = json.load(sys.stdin)
        script = data.get('script', '')
        output_dir = data.get('output_dir', './output')
        level = data.get('level', 'beginner')
    else:
        print("🎙️  Ovi English School - Audio Generator (Qwen3-TTS)")
        print("=" * 50)
        print("\nUsage:")
        print("  python audio-generator.py <script.txt> [output_dir]")
        print("  python audio-generator.py --test")
        print("\nVoice presets: beginner, intermediate, advanced, spanish")
        return

    generate_episode(script, output_dir, level)


if __name__ == "__main__":
    main()
