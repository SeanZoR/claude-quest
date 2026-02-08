#!/usr/bin/env python3
"""
Merge achievement content from multiple agent outputs into a single file.
Validates content quality and reports any issues.
"""

import json
import os
import sys
from pathlib import Path
from typing import Any

REQUIRED_FIELDS = ['longDescription', 'whyItMatters', 'difficulty', 'howTo', 'examples']
VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced']
MIN_LONG_DESC_WORDS = 40
MAX_LONG_DESC_WORDS = 100
MIN_WHY_WORDS = 15
MAX_WHY_WORDS = 40

def count_words(text: str) -> int:
    return len(text.split())

def validate_content(achievement_id: str, content: dict, all_ids: set) -> list[str]:
    """Validate a single achievement's content and return list of issues."""
    issues = []

    # Check required fields
    for field in REQUIRED_FIELDS:
        if field not in content:
            issues.append(f"Missing required field: {field}")

    # Validate longDescription
    if 'longDescription' in content:
        word_count = count_words(content['longDescription'])
        if word_count < MIN_LONG_DESC_WORDS:
            issues.append(f"longDescription too short: {word_count} words (min {MIN_LONG_DESC_WORDS})")
        if word_count > MAX_LONG_DESC_WORDS:
            issues.append(f"longDescription too long: {word_count} words (max {MAX_LONG_DESC_WORDS})")

    # Validate whyItMatters
    if 'whyItMatters' in content:
        word_count = count_words(content['whyItMatters'])
        if word_count < MIN_WHY_WORDS:
            issues.append(f"whyItMatters too short: {word_count} words (min {MIN_WHY_WORDS})")
        if word_count > MAX_WHY_WORDS:
            issues.append(f"whyItMatters too long: {word_count} words (max {MAX_WHY_WORDS})")

    # Validate difficulty
    if 'difficulty' in content and content['difficulty'] not in VALID_DIFFICULTIES:
        issues.append(f"Invalid difficulty: {content['difficulty']}")

    # Validate howTo
    if 'howTo' in content:
        howTo = content['howTo']
        if 'summary' not in howTo:
            issues.append("howTo missing summary")
        if 'steps' not in howTo or not howTo['steps']:
            issues.append("howTo missing steps")
        elif len(howTo['steps']) < 2:
            issues.append(f"howTo has too few steps: {len(howTo['steps'])} (min 2)")

    # Validate examples
    if 'examples' in content:
        if not content['examples']:
            issues.append("examples array is empty")
        else:
            for i, example in enumerate(content['examples']):
                if 'code' not in example:
                    issues.append(f"example[{i}] missing code")
                elif 'content' not in example['code'] or 'language' not in example['code']:
                    issues.append(f"example[{i}].code missing content or language")

    # Validate relatedAchievements references
    if 'relatedAchievements' in content:
        for related_id in content['relatedAchievements']:
            if related_id not in all_ids:
                issues.append(f"Invalid relatedAchievement ID: {related_id}")

    return issues

def merge_agent_outputs(data_dir: Path) -> tuple[dict, dict]:
    """Merge all agent outputs and return merged content + validation report."""
    merged_content = {}
    validation_report = {
        'total_achievements': 0,
        'valid_achievements': 0,
        'achievements_with_issues': 0,
        'issues_by_achievement': {},
        'missing_achievements': []
    }

    # Load all achievement IDs
    with open(data_dir / 'achievements.json') as f:
        achievements_data = json.load(f)
    all_ids = {a['id'] for a in achievements_data['achievements']}
    validation_report['total_achievements'] = len(all_ids)

    # Find and merge agent output files
    agent_files = sorted(data_dir.glob('content-agent*.json'))

    if not agent_files:
        print("No agent output files found!")
        return merged_content, validation_report

    print(f"Found {len(agent_files)} agent output files")

    for agent_file in agent_files:
        print(f"Processing {agent_file.name}...")
        try:
            with open(agent_file) as f:
                agent_data = json.load(f)

            agent_content = agent_data.get('content', {})
            print(f"  - {len(agent_content)} achievements")

            for achievement_id, content in agent_content.items():
                if achievement_id in merged_content:
                    print(f"  WARNING: Duplicate achievement ID: {achievement_id}")
                    continue

                # Validate content
                issues = validate_content(achievement_id, content, all_ids)

                if issues:
                    validation_report['achievements_with_issues'] += 1
                    validation_report['issues_by_achievement'][achievement_id] = issues
                else:
                    validation_report['valid_achievements'] += 1

                merged_content[achievement_id] = content

        except json.JSONDecodeError as e:
            print(f"  ERROR: Failed to parse {agent_file.name}: {e}")
        except Exception as e:
            print(f"  ERROR: {e}")

    # Check for missing achievements
    found_ids = set(merged_content.keys())
    missing_ids = all_ids - found_ids
    validation_report['missing_achievements'] = sorted(missing_ids)

    return merged_content, validation_report

def main():
    data_dir = Path(__file__).parent

    print("=" * 60)
    print("Achievement Content Merger")
    print("=" * 60)

    merged_content, report = merge_agent_outputs(data_dir)

    # Print validation report
    print("\n" + "=" * 60)
    print("Validation Report")
    print("=" * 60)
    print(f"Total achievements expected: {report['total_achievements']}")
    print(f"Achievements with content:   {len(merged_content)}")
    print(f"Valid achievements:          {report['valid_achievements']}")
    print(f"Achievements with issues:    {report['achievements_with_issues']}")
    print(f"Missing achievements:        {len(report['missing_achievements'])}")

    if report['missing_achievements']:
        print(f"\nMissing achievement IDs:")
        for aid in report['missing_achievements'][:10]:
            print(f"  - {aid}")
        if len(report['missing_achievements']) > 10:
            print(f"  ... and {len(report['missing_achievements']) - 10} more")

    if report['issues_by_achievement']:
        print(f"\nAchievements with issues:")
        for aid, issues in list(report['issues_by_achievement'].items())[:5]:
            print(f"\n  {aid}:")
            for issue in issues:
                print(f"    - {issue}")
        if len(report['issues_by_achievement']) > 5:
            print(f"\n  ... and {len(report['issues_by_achievement']) - 5} more with issues")

    # Write merged output
    output_file = data_dir / 'achievement-content.json'
    output_data = {
        'version': '1.0',
        'generated': True,
        'total_content': len(merged_content),
        'content': merged_content
    }

    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)

    print(f"\nOutput written to: {output_file}")
    print(f"File size: {output_file.stat().st_size / 1024:.1f} KB")

    # Write validation report
    report_file = data_dir / 'content-validation-report.json'
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"Validation report: {report_file}")

    # Exit with error if missing content
    if report['missing_achievements']:
        print(f"\nWARNING: {len(report['missing_achievements'])} achievements missing content!")
        return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())
