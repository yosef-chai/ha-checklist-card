@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>&1

:: ============================================================
::  ha-checklist-card — Release Script
::  Usage: release.bat [patch|minor|major] ["release message"]
::  Example: release.bat patch "Fix item toggle bug"
::           release.bat minor "Add color themes support"
::           release.bat major "Full rewrite"
:: ============================================================

set "REPO_DIR=%~dp0"
set "BUMP_TYPE=%~1"
set "RELEASE_MSG=%~2"
set "AUTO_YES=%~3"
set "DIST_FILE=dist\checklist-card.js"

:: ── Colours (ANSI via PowerShell echo trick) ────────────────
for /f %%A in ('powershell -NoProfile -Command "[char]27"') do set "ESC=%%A"
set "C_RESET=%ESC%[0m"
set "C_BOLD=%ESC%[1m"
set "C_RED=%ESC%[91m"
set "C_GREEN=%ESC%[92m"
set "C_YELLOW=%ESC%[93m"
set "C_CYAN=%ESC%[96m"
set "C_BLUE=%ESC%[94m"
set "C_DIM=%ESC%[2m"

:: ── Helpers ─────────────────────────────────────────────────
goto :main

:print_header
    echo.
    echo %C_BOLD%%C_BLUE%╔══════════════════════════════════════════════╗%C_RESET%
    echo %C_BOLD%%C_BLUE%║       ha-checklist-card  Release Tool        ║%C_RESET%
    echo %C_BOLD%%C_BLUE%╚══════════════════════════════════════════════╝%C_RESET%
    echo.
    exit /b 0

:step
    echo %C_BOLD%%C_CYAN%[•] %~1%C_RESET%
    exit /b 0

:ok
    echo %C_GREEN%[✓] %~1%C_RESET%
    exit /b 0

:warn
    echo %C_YELLOW%[!] %~1%C_RESET%
    exit /b 0

:fail
    echo.
    echo %C_RED%%C_BOLD%[✗] ERROR: %~1%C_RESET%
    echo.
    exit /b 1

:usage
    echo.
    echo %C_BOLD%Usage:%C_RESET%
    echo   release.bat %C_CYAN%^<patch^|minor^|major^>%C_RESET% %C_DIM%["release message"]%C_RESET%
    echo.
    echo %C_BOLD%Examples:%C_RESET%
    echo   release.bat patch
    echo   release.bat minor "Add color themes"
    echo   release.bat major "Breaking API change"
    echo.
    echo %C_BOLD%Version types:%C_RESET%
    echo   %C_CYAN%patch%C_RESET%  — bug fixes              1.1.0 → 1.1.1
    echo   %C_CYAN%minor%C_RESET%  — new features           1.1.0 → 1.2.0
    echo   %C_CYAN%major%C_RESET%  — breaking changes       1.1.0 → 2.0.0
    echo.
    exit /b 0

:: ── Main ────────────────────────────────────────────────────
:main
call :print_header

cd /d "%REPO_DIR%"

:: ── 1. Validate arguments ────────────────────────────────────
call :step "Validating arguments..."

if "%BUMP_TYPE%"=="" (
    call :warn "No bump type provided."
    call :usage
    pause
    exit /b 1
)
if /i not "%BUMP_TYPE%"=="patch" if /i not "%BUMP_TYPE%"=="minor" if /i not "%BUMP_TYPE%"=="major" (
    call :fail "Invalid bump type: '%BUMP_TYPE%'. Must be patch, minor, or major."
    call :usage
    pause
    exit /b 1
)
call :ok "Bump type: %C_CYAN%%BUMP_TYPE%%C_RESET%"

:: ── 2. Check required tools ──────────────────────────────────
call :step "Checking required tools..."

where git >nul 2>&1 || ( call :fail "git not found in PATH." & pause & exit /b 1 )
where npm >nul 2>&1 || ( call :fail "npm not found in PATH." & pause & exit /b 1 )
where gh  >nul 2>&1 || ( call :fail "GitHub CLI (gh) not found. Install from https://cli.github.com" & pause & exit /b 1 )

call :ok "git, npm, gh — all found"

:: ── 3. Check git status ──────────────────────────────────────
call :step "Checking git working directory..."

git diff --quiet HEAD >nul 2>&1
if errorlevel 1 (
    echo.
    echo %C_YELLOW%  Uncommitted changes detected:%C_RESET%
    git status --short
    echo.
    if /i "%AUTO_YES%"=="-y" (
        set "CONFIRM=Y"
    ) else (
        set /p "CONFIRM=  Commit all changes before releasing? [Y/n]: "
    )
    if /i "!CONFIRM!"=="n" (
        call :fail "Aborted. Please commit or stash your changes first."
        pause
        exit /b 1
    )
    echo.
)

:: Check we are on master / main
for /f %%B in ('git rev-parse --abbrev-ref HEAD') do set "CURRENT_BRANCH=%%B"
if /i not "%CURRENT_BRANCH%"=="master" if /i not "%CURRENT_BRANCH%"=="main" (
    call :warn "You are on branch '%CURRENT_BRANCH%', not master/main."
    if /i "%AUTO_YES%"=="-y" (
        set "CONFIRM=y"
    ) else (
        set /p "CONFIRM=  Continue anyway? [y/N]: "
    )
    if /i not "!CONFIRM!"=="y" (
        call :fail "Aborted."
        pause
        exit /b 1
    )
)
call :ok "On branch: %CURRENT_BRANCH%"

:: ── 4. Pull latest ──────────────────────────────────────────
call :step "Pulling latest from origin..."

git pull --rebase origin %CURRENT_BRANCH% >nul 2>&1
if errorlevel 1 (
    call :fail "git pull failed. Resolve conflicts and try again."
    pause
    exit /b 1
)
call :ok "Up to date with origin"

:: ── 5. Read current version ──────────────────────────────────
call :step "Reading current version from package.json..."

for /f "tokens=2 delims=:, " %%V in ('git show HEAD:package.json ^| findstr /C:"\"version\""') do (
    set "CURRENT_VERSION=%%~V"
    goto :version_found
)
:version_found
set "CURRENT_VERSION=%CURRENT_VERSION:"=%"
call :ok "Current version: %C_CYAN%v%CURRENT_VERSION%%C_RESET%"

:: ── 6. Calculate next version ───────────────────────────────
call :step "Calculating new version (%BUMP_TYPE%)..."

for /f "tokens=1,2,3 delims=." %%A in ("%CURRENT_VERSION%") do (
    set /a "VER_MAJOR=%%A"
    set /a "VER_MINOR=%%B"
    set /a "VER_PATCH=%%C"
)

if /i "%BUMP_TYPE%"=="major" (
    set /a "VER_MAJOR+=1" & set "VER_MINOR=0" & set "VER_PATCH=0"
) else if /i "%BUMP_TYPE%"=="minor" (
    set /a "VER_MINOR+=1" & set "VER_PATCH=0"
) else (
    set /a "VER_PATCH+=1"
)

set "NEW_VERSION=%VER_MAJOR%.%VER_MINOR%.%VER_PATCH%"
set "NEW_TAG=v%NEW_VERSION%"

echo.
echo   %C_DIM%  %CURRENT_VERSION%  →  %C_RESET%%C_BOLD%%C_GREEN%%NEW_VERSION%%C_RESET%
echo.

:: Confirm
if /i "%AUTO_YES%"=="-y" (
    echo   Auto-confirming release %NEW_TAG%...
) else (
    set /p "CONFIRM=  Proceed with release %NEW_TAG%? [Y/n]: "
    if /i "!CONFIRM!"=="n" (
        call :warn "Release cancelled by user."
        pause
        exit /b 0
    )
)
echo.

:: ── 7. Check tag doesn't already exist ──────────────────────
git tag | findstr /x /c:"%NEW_TAG%" >nul 2>&1
if not errorlevel 1 (
    call :fail "Tag '%NEW_TAG%' already exists. Delete it first with: git tag -d %NEW_TAG%"
    pause
    exit /b 1
)

:: ── 8. Bump version in package.json ─────────────────────────
call :step "Updating version in package.json..."

powershell -NoProfile -Command ^
  "(Get-Content package.json -Raw) -replace '\"version\": \"%CURRENT_VERSION%\"', '\"version\": \"%NEW_VERSION%\"' | Set-Content package.json -NoNewline -Encoding utf8"
if errorlevel 1 (
    call :fail "Failed to update package.json"
    pause
    exit /b 1
)
call :ok "package.json updated to %NEW_VERSION%"

:: ── 9. Build ─────────────────────────────────────────────────
call :step "Building project (npm run build)..."
echo.

npm run build
if errorlevel 1 (
    echo.
    call :fail "Build failed. Rolling back package.json..."
    powershell -NoProfile -Command ^
      "(Get-Content package.json -Raw) -replace '\"version\": \"%NEW_VERSION%\"', '\"version\": \"%CURRENT_VERSION%\"' | Set-Content package.json -NoNewline -Encoding utf8"
    pause
    exit /b 1
)

echo.
if not exist "%DIST_FILE%" (
    call :fail "Build output not found: %DIST_FILE%"
    pause
    exit /b 1
)

for %%F in ("%DIST_FILE%") do set "DIST_SIZE=%%~zF"
set /a "DIST_KB=%DIST_SIZE% / 1024"
call :ok "Built %DIST_FILE% (%DIST_KB% KB)"

:: ── 10. Stage and commit ─────────────────────────────────────
call :step "Staging changes..."

git add -u
git add package.json "%DIST_FILE%"
if errorlevel 1 ( call :fail "git add failed" & pause & exit /b 1 )
call :ok "Staged all modified tracked files"

:: Build commit message
if "%RELEASE_MSG%"=="" (
    set "COMMIT_MSG=chore: release %NEW_TAG%"
) else (
    set "COMMIT_MSG=chore: release %NEW_TAG% — %RELEASE_MSG%"
)

call :step "Committing..."
git commit -m "!COMMIT_MSG!"
if errorlevel 1 ( call :fail "git commit failed" & pause & exit /b 1 )
call :ok "Committed: !COMMIT_MSG!"

:: ── 11. Create tag ───────────────────────────────────────────
call :step "Creating tag %NEW_TAG%..."

git tag -a "%NEW_TAG%" -m "Release %NEW_TAG%"
if errorlevel 1 ( call :fail "git tag failed" & pause & exit /b 1 )
call :ok "Tag created: %NEW_TAG%"

:: ── 12. Push ─────────────────────────────────────────────────
call :step "Pushing to origin..."

git push origin %CURRENT_BRANCH%
if errorlevel 1 ( call :fail "git push (branch) failed" & pause & exit /b 1 )

git push origin "%NEW_TAG%"
if errorlevel 1 ( call :fail "git push (tag) failed" & pause & exit /b 1 )

call :ok "Pushed branch and tag to origin"

:: ── 13. Create GitHub release ────────────────────────────────
call :step "Creating GitHub release %NEW_TAG%..."

if "%RELEASE_MSG%"=="" (
    set "RELEASE_NOTES=Release %NEW_TAG%"
) else (
    set "RELEASE_NOTES=%RELEASE_MSG%"
)

gh release create "%NEW_TAG%" "%DIST_FILE%" ^
    --title "%NEW_TAG%" ^
    --notes "## Checklist Card %NEW_TAG%

%RELEASE_NOTES%

### Installation
Search for **Checklist Card** in HACS → Frontend, or download \`checklist-card.js\` and place it in \`config/www/\`."

if errorlevel 1 ( call :fail "gh release create failed" & pause & exit /b 1 )
call :ok "GitHub release created"

:: ── 14. Done ─────────────────────────────────────────────────
echo.
echo %C_BOLD%%C_GREEN%╔══════════════════════════════════════════════╗%C_RESET%
echo %C_BOLD%%C_GREEN%║   Release %NEW_TAG% published successfully!   %C_RESET%%C_BOLD%%C_GREEN%║%C_RESET%
echo %C_BOLD%%C_GREEN%╚══════════════════════════════════════════════╝%C_RESET%
echo.
echo   %C_DIM%Repository:%C_RESET%  https://github.com/yosef-chai/ha-checklist-card
echo   %C_DIM%Release:%C_RESET%     https://github.com/yosef-chai/ha-checklist-card/releases/tag/%NEW_TAG%
echo.

endlocal
if /i not "%~3"=="-y" pause
exit /b 0
