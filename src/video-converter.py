#!/usr/bin/env python3
"""
Video Converter - Creates videos from audio + images
Supports static background or dynamic scene-based slideshow.
"""

import subprocess
import os
import sys
import argparse
import json
from pathlib import Path

# Default background image (will be created if not exists)
DEFAULT_BG = Path(__file__).parent.parent / "assets" / "youtube-bg.png"

def create_default_background(output_path: Path):
    """Create a simple branded background using FFmpeg"""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Create 1920x1080 dark blue gradient background with text
    cmd = [
        'ffmpeg', '-y',
        '-f', 'lavfi',
        '-i', 'color=c=#1E3A5F:s=1920x1080:d=1',
        '-vf', (
            "drawtext=text='🎓 Ovi English School':"
            "fontsize=72:fontcolor=white:"
            "x=(w-text_w)/2:y=h/2-100,"
            "drawtext=text='Learn English with Real News':"
            "fontsize=36:fontcolor=#AAAAAA:"
            "x=(w-text_w)/2:y=h/2+50"
        ),
        '-frames:v', '1',
        str(output_path)
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Created background: {output_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Could not create fancy background, using solid color")
        # Fallback: simple solid color
        cmd_simple = [
            'ffmpeg', '-y',
            '-f', 'lavfi',
            '-i', 'color=c=#1E3A5F:s=1920x1080:d=1',
            '-frames:v', '1',
            str(output_path)
        ]
        subprocess.run(cmd_simple, check=True, capture_output=True)
        return True

def audio_to_video(audio_path: str, output_path: str = None, background: str = None):
    """
    Convert audio file to video with static background

    Args:
        audio_path: Path to MP3/audio file
        output_path: Path for output MP4 (default: same name as audio)
        background: Path to background image (default: branded background)
    """
    audio_path = Path(audio_path)

    if not audio_path.exists():
        print(f"❌ Audio file not found: {audio_path}")
        return None

    # Set output path
    if output_path:
        output_path = Path(output_path)
    else:
        output_path = audio_path.with_suffix('.mp4')

    # Set background
    if background:
        bg_path = Path(background)
    else:
        bg_path = DEFAULT_BG
        if not bg_path.exists():
            print("📷 Creating default background...")
            create_default_background(bg_path)

    if not bg_path.exists():
        print(f"❌ Background image not found: {bg_path}")
        return None

    print(f"\n🎬 Converting audio to video...")
    print(f"   Audio: {audio_path.name}")
    print(f"   Background: {bg_path.name}")

    # FFmpeg command to create video
    # -loop 1: loop image
    # -tune stillimage: optimize for static image
    # -shortest: stop when audio ends
    cmd = [
        'ffmpeg', '-y',
        '-loop', '1',
        '-i', str(bg_path),
        '-i', str(audio_path),
        '-c:v', 'libx264',
        '-tune', 'stillimage',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-shortest',
        '-movflags', '+faststart',
        str(output_path)
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"✅ Video created: {output_path.name} ({size_mb:.1f} MB)")
            return str(output_path)
        else:
            print(f"❌ FFmpeg error: {result.stderr}")
            return None
    except FileNotFoundError:
        print("❌ FFmpeg not found! Install with: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)")
    return None

def get_audio_duration(audio_path: Path) -> float:
    """Return audio duration in seconds using ffprobe."""
    cmd = [
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        str(audio_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        return 0.0
    try:
        return float(result.stdout.strip())
    except ValueError:
        return 0.0

def build_concat_file(scenes, images_dir: Path, audio_duration: float, concat_path: Path):
    """Write ffmpeg concat list with durations adjusted to audio length."""
    total_scene_duration = sum(s.get('duration', 0) for s in scenes) or 1.0
    scale = audio_duration / total_scene_duration if audio_duration > 0 else 1.0

    lines = []
    for idx, scene in enumerate(scenes):
        image_name = scene.get('image') or f"scene-{str(idx + 1).zfill(3)}.png"
        image_path = images_dir / image_name
        duration = max(2.0, float(scene.get('duration', 4.0)) * scale)
        lines.append(f"file '{image_path}'")
        lines.append(f"duration {duration:.2f}")

    # Repeat last file without duration (ffmpeg concat requirement)
    if scenes:
        last_image = scenes[-1].get('image') or f"scene-{str(len(scenes)).zfill(3)}.png"
        lines.append(f"file '{(images_dir / last_image)}'")

    concat_path.write_text('\n'.join(lines))

def scenes_to_video(audio_path: str, scenes_path: str, output_path: str = None, images_dir: str = None):
    """
    Convert audio + scene images into a dynamic slideshow video.
    """
    audio_path = Path(audio_path)
    if not audio_path.exists():
        print(f"❌ Audio file not found: {audio_path}")
        return None

    scenes_path = Path(scenes_path)
    if not scenes_path.exists():
        print(f"❌ Scenes file not found: {scenes_path}")
        return None

    if output_path:
        output_path = Path(output_path)
    else:
        output_path = audio_path.with_suffix('.mp4')

    scenes_data = json.loads(scenes_path.read_text())
    scenes = scenes_data.get('scenes', [])
    if not scenes:
        print("❌ No scenes found in scenes.json")
        return None

    images_dir = Path(images_dir) if images_dir else scenes_path.parent / "scenes"
    if not images_dir.exists():
        print(f"❌ Images directory not found: {images_dir}")
        return None

    audio_duration = get_audio_duration(audio_path)
    concat_file = scenes_path.parent / "scene_concat.txt"
    build_concat_file(scenes, images_dir, audio_duration, concat_file)

    print(f"\n🎬 Creating dynamic video from scenes...")
    print(f"   Audio: {audio_path.name}")
    print(f"   Scenes: {len(scenes)}")
    print(f"   Images: {images_dir}")

    vf = (
        "scale=1920:1080:force_original_aspect_ratio=decrease,"
        "pad=1920:1080:(ow-iw)/2:(oh-ih)/2,"
        "format=yuv420p"
    )

    cmd = [
        'ffmpeg', '-y',
        '-f', 'concat', '-safe', '0',
        '-i', str(concat_file),
        '-i', str(audio_path),
        '-c:v', 'libx264',
        '-r', '30',
        '-pix_fmt', 'yuv420p',
        '-vf', vf,
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        '-movflags', '+faststart',
        str(output_path)
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"✅ Video created: {output_path.name} ({size_mb:.1f} MB)")
        return str(output_path)
    else:
        print(f"❌ FFmpeg error: {result.stderr}")
        return None

def batch_convert(audio_dir: str, output_dir: str = None):
    """Convert all MP3 files in a directory"""
    audio_dir = Path(audio_dir)
    output_dir = Path(output_dir) if output_dir else audio_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    mp3_files = list(audio_dir.glob("*.mp3"))
    print(f"\n📁 Found {len(mp3_files)} audio files")

    results = []
    for mp3 in mp3_files:
        output = output_dir / mp3.with_suffix('.mp4').name
        result = audio_to_video(str(mp3), str(output))
        if result:
            results.append(result)

    print(f"\n✅ Converted {len(results)}/{len(mp3_files)} files")
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert audio to YouTube video")
    parser.add_argument("audio", nargs="?", help="Audio file (MP3)")
    parser.add_argument("-o", "--output", help="Output video path")
    parser.add_argument("-b", "--background", help="Background image")
    parser.add_argument("--scenes", help="Scenes JSON file for dynamic visuals")
    parser.add_argument("--images-dir", help="Directory with scene images")
    parser.add_argument("--batch", help="Convert all MP3s in directory")
    parser.add_argument("--create-bg", action="store_true", help="Create default background")

    args = parser.parse_args()

    if args.create_bg:
        create_default_background(DEFAULT_BG)
    elif args.batch:
        batch_convert(args.batch, args.output)
    elif args.audio and args.scenes:
        scenes_to_video(args.audio, args.scenes, args.output, args.images_dir)
    elif args.audio:
        audio_to_video(args.audio, args.output, args.background)
    else:
        parser.print_help()
