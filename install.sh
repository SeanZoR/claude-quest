#!/bin/bash
#
# Claude Quest Installer
# A gamification system for Claude Code
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/SeanZoR/claude-quest/main/install.sh | bash
#

set -e

# ============================================================================
# Configuration
# ============================================================================

REPO_URL="https://github.com/SeanZoR/claude-quest.git"
RAW_BASE_URL="https://raw.githubusercontent.com/SeanZoR/claude-quest/main"
CLAUDE_DIR="$HOME/.claude"
QUEST_DATA_DIR="$CLAUDE_DIR/claude-quest"
SKILLS_DIR="$CLAUDE_DIR/skills"
COMMANDS_DIR="$CLAUDE_DIR/commands"
VERSION="1.0.0"

# ============================================================================
# Color Support
# ============================================================================

setup_colors() {
    if [[ -t 1 ]] && [[ -n "$TERM" ]] && [[ "$TERM" != "dumb" ]]; then
        RED='\033[0;31m'
        GREEN='\033[0;32m'
        YELLOW='\033[0;33m'
        BLUE='\033[0;34m'
        MAGENTA='\033[0;35m'
        CYAN='\033[0;36m'
        WHITE='\033[1;37m'
        BOLD='\033[1m'
        DIM='\033[2m'
        NC='\033[0m' # No Color
    else
        RED=''
        GREEN=''
        YELLOW=''
        BLUE=''
        MAGENTA=''
        CYAN=''
        WHITE=''
        BOLD=''
        DIM=''
        NC=''
    fi
}

# ============================================================================
# Utility Functions
# ============================================================================

print_step() {
    echo -e "${CYAN}==>${NC} ${BOLD}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

print_info() {
    echo -e "${DIM}$1${NC}"
}

# Cleanup function for temp files
cleanup() {
    if [[ -n "$TEMP_DIR" ]] && [[ -d "$TEMP_DIR" ]]; then
        rm -rf "$TEMP_DIR"
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# ============================================================================
# Prerequisite Checks
# ============================================================================

check_prerequisites() {
    print_step "Checking prerequisites..."

    # Check if Claude Code is installed (via ~/.claude directory)
    if [[ ! -d "$CLAUDE_DIR" ]]; then
        print_error "Claude Code not detected!"
        echo ""
        echo "  The ~/.claude directory doesn't exist."
        echo "  Please install Claude Code first:"
        echo ""
        echo "    npm install -g @anthropic-ai/claude-code"
        echo ""
        echo "  Then run this installer again."
        exit 1
    fi
    print_success "Claude Code detected"

    # Check for git or curl
    HAS_GIT=false
    HAS_CURL=false

    if command -v git &> /dev/null; then
        HAS_GIT=true
        print_success "git is available"
    fi

    if command -v curl &> /dev/null; then
        HAS_CURL=true
        print_success "curl is available"
    fi

    if [[ "$HAS_GIT" == false ]] && [[ "$HAS_CURL" == false ]]; then
        print_error "Neither git nor curl found!"
        echo ""
        echo "  Please install git or curl and try again."
        exit 1
    fi
}

# ============================================================================
# Check Existing Installation
# ============================================================================

check_existing_installation() {
    local installed=false

    if [[ -d "$SKILLS_DIR/claude-quest" ]] || [[ -f "$COMMANDS_DIR/quest.md" ]] || [[ -d "$QUEST_DATA_DIR" ]]; then
        installed=true
    fi

    if [[ "$installed" == true ]]; then
        print_warning "Claude Quest appears to be already installed."
        echo ""
        read -p "  Would you like to reinstall? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "  Installation cancelled. Your existing installation is unchanged."
            echo "  Run ${CYAN}/quest${NC} in Claude Code to continue your adventure!"
            exit 0
        fi
        print_info "Reinstalling Claude Quest..."
        echo ""
    fi
}

# ============================================================================
# Download Repository
# ============================================================================

download_repository() {
    print_step "Downloading Claude Quest..."

    TEMP_DIR=$(mktemp -d)

    if [[ "$HAS_GIT" == true ]]; then
        # Prefer git clone for complete repository
        if git clone --quiet --depth 1 "$REPO_URL" "$TEMP_DIR/claude-quest" 2>/dev/null; then
            print_success "Repository cloned successfully"
            REPO_DIR="$TEMP_DIR/claude-quest"
            return 0
        else
            print_warning "Git clone failed, falling back to curl..."
        fi
    fi

    if [[ "$HAS_CURL" == true ]]; then
        # Fallback to curl for individual files
        REPO_DIR="$TEMP_DIR/claude-quest"
        mkdir -p "$REPO_DIR/skills/claude-quest/data"
        mkdir -p "$REPO_DIR/skills/claude-quest/runner"
        mkdir -p "$REPO_DIR/commands"

        # Download main skill file
        if ! curl -sSL "$RAW_BASE_URL/skills/claude-quest/SKILL.md" -o "$REPO_DIR/skills/claude-quest/SKILL.md" 2>/dev/null; then
            print_error "Failed to download skills/claude-quest/SKILL.md"
            exit 1
        fi

        # Download data files
        local data_files=(
            "achievements.json"
            "levels.json"
            "progress.schema.json"
        )

        for file in "${data_files[@]}"; do
            if ! curl -sSL "$RAW_BASE_URL/skills/claude-quest/data/$file" -o "$REPO_DIR/skills/claude-quest/data/$file" 2>/dev/null; then
                print_error "Failed to download skills/claude-quest/data/$file"
                exit 1
            fi
        done

        # Download runner files
        if ! curl -sSL "$RAW_BASE_URL/skills/claude-quest/runner/main.md" -o "$REPO_DIR/skills/claude-quest/runner/main.md" 2>/dev/null; then
            print_error "Failed to download skills/claude-quest/runner/main.md"
            exit 1
        fi

        # Download command file
        if ! curl -sSL "$RAW_BASE_URL/commands/quest.md" -o "$REPO_DIR/commands/quest.md" 2>/dev/null; then
            print_error "Failed to download commands/quest.md"
            exit 1
        fi

        print_success "Files downloaded successfully"
        return 0
    fi

    print_error "Failed to download repository"
    exit 1
}

# ============================================================================
# Install Files
# ============================================================================

install_skill() {
    print_step "Installing skill..."

    # Create skills directory if it doesn't exist
    mkdir -p "$SKILLS_DIR"

    # Remove existing skill if present
    if [[ -d "$SKILLS_DIR/claude-quest" ]]; then
        rm -rf "$SKILLS_DIR/claude-quest"
    fi

    # Copy skill directory
    if [[ -d "$REPO_DIR/skills/claude-quest" ]]; then
        cp -r "$REPO_DIR/skills/claude-quest" "$SKILLS_DIR/"
        print_success "Skill installed to ~/.claude/skills/claude-quest/"
    else
        print_error "Skill files not found in downloaded repository"
        exit 1
    fi
}

install_command() {
    print_step "Installing command..."

    # Create commands directory if it doesn't exist
    mkdir -p "$COMMANDS_DIR"

    # Copy command file
    if [[ -f "$REPO_DIR/commands/quest.md" ]]; then
        cp "$REPO_DIR/commands/quest.md" "$COMMANDS_DIR/"
        print_success "Command installed to ~/.claude/commands/quest.md"
    else
        print_error "Command file not found in downloaded repository"
        exit 1
    fi
}

# ============================================================================
# Initialize Progress
# ============================================================================

initialize_progress() {
    print_step "Initializing progress tracker..."

    # Create quest data directory
    mkdir -p "$QUEST_DATA_DIR"

    # Get current ISO timestamp
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Create initial progress.json (only if it doesn't exist to preserve progress on reinstall)
    if [[ ! -f "$QUEST_DATA_DIR/progress.json" ]]; then
        cat > "$QUEST_DATA_DIR/progress.json" << EOF
{
  "version": "$VERSION",
  "installedAt": "$timestamp",
  "lastScan": null,
  "totalXP": 0,
  "level": 1,
  "streak": {
    "current": 0,
    "lastActiveDate": null,
    "longest": 0
  },
  "achievements": {},
  "stats": {
    "totalScans": 0,
    "achievementsUnlocked": 0
  }
}
EOF
        print_success "Created new progress file"
    else
        print_success "Preserved existing progress data"
    fi
}

# ============================================================================
# Verify Installation
# ============================================================================

verify_installation() {
    print_step "Verifying installation..."

    local success=true

    if [[ -f "$SKILLS_DIR/claude-quest/SKILL.md" ]]; then
        print_success "SKILL.md present"
    else
        print_error "SKILL.md missing"
        success=false
    fi

    if [[ -f "$SKILLS_DIR/claude-quest/data/achievements.json" ]]; then
        print_success "data/achievements.json present"
    else
        print_error "data/achievements.json missing"
        success=false
    fi

    if [[ -f "$SKILLS_DIR/claude-quest/data/levels.json" ]]; then
        print_success "data/levels.json present"
    else
        print_error "data/levels.json missing"
        success=false
    fi

    if [[ -f "$SKILLS_DIR/claude-quest/runner/main.md" ]]; then
        print_success "runner/main.md present"
    else
        print_error "runner/main.md missing"
        success=false
    fi

    if [[ -f "$COMMANDS_DIR/quest.md" ]]; then
        print_success "quest.md command present"
    else
        print_error "quest.md command missing"
        success=false
    fi

    if [[ -f "$QUEST_DATA_DIR/progress.json" ]]; then
        print_success "progress.json present"
    else
        print_error "progress.json missing"
        success=false
    fi

    if [[ "$success" == false ]]; then
        print_error "Installation verification failed!"
        exit 1
    fi
}

# ============================================================================
# Welcome Message
# ============================================================================

print_welcome() {
    echo ""
    echo -e "${MAGENTA}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║${NC}                                                              ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}              ${YELLOW}⚔️  CLAUDE QUEST INSTALLED  ⚔️${NC}                  ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}                                                              ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}     ${WHITE}Your adventure begins!${NC} Track your progress as you       ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}     master Claude Code's powerful features.                  ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}                                                              ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${MAGENTA}║${NC}                                                              ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}  ${CYAN}NEXT STEPS:${NC}                                                 ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}  ${GREEN}1.${NC} Start a new Claude Code session                          ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}  ${GREEN}2.${NC} Type ${BOLD}/quest${NC} to see your dashboard                        ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}  ${GREEN}3.${NC} Complete quests to earn XP and level up!                 ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║${NC}                                                              ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${DIM}90 achievements await. Good luck, adventurer!${NC}"
    echo ""
}

# ============================================================================
# Main
# ============================================================================

main() {
    echo ""
    echo -e "${BOLD}${MAGENTA}⚔️  Claude Quest Installer${NC}"
    echo -e "${DIM}   Gamification for Claude Code${NC}"
    echo ""

    setup_colors
    check_prerequisites
    check_existing_installation
    download_repository
    install_skill
    install_command
    initialize_progress
    verify_installation
    print_welcome
}

main "$@"
