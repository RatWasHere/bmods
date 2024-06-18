@ECHO OFF
SETLOCAL

:: **1. Customizable Settings**
SET "git_url=https://github.com/RatWasHere/bmods.git"
SET "steam_install_dir=C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord"
SET "actions_dest=%steam_install_dir%\AppData\Actions"
SET "themes_dest=%steam_install_dir%\Themes"
SET "temp_dir=%TEMP%\bmods"

:: **2. Check for Git Installation**
ECHO Checking for Git installation...
git --version >NUL 2>&1
IF ERRORLEVEL 1 (
    ECHO Git is not installed or not available in PATH.
    PAUSE
    EXIT /B 1
)
ECHO Git is installed.

:: **3. Verify Destination Directories**
ECHO Verifying destination directories...
IF NOT EXIST "%steam_install_dir%" (
    ECHO The Steam installation directory does not exist: "%steam_install_dir%"
    PAUSE
    EXIT /B 1
)
IF NOT EXIST "%actions_dest%" (
    ECHO The actions destination directory does not exist: "%actions_dest%"
    PAUSE
    EXIT /B 1
)
IF NOT EXIST "%themes_dest%" (
    ECHO The themes destination directory does not exist: "%themes_dest%"
    PAUSE
    EXIT /B 1
)
ECHO Directories verified.

:: **4. Downloading the Repository**
ECHO Downloading bmods repository...
IF EXIST "%temp_dir%" RD /S /Q "%temp_dir%"
git clone "%git_url%" "%temp_dir%"
IF ERRORLEVEL 1 (
    ECHO Failed to clone the repository.
    PAUSE
    EXIT /B 1
)
ECHO Repository downloaded.

:: **5. Extraction with Specific Destinations**
ECHO Extracting bmods...
xcopy "%temp_dir%\actions" "%actions_dest%" /E /Y >NUL
IF ERRORLEVEL 1 (
    ECHO Failed to copy actions to "%actions_dest%".
    PAUSE
    EXIT /B 1
)
xcopy "%temp_dir%\themes" "%themes_dest%" /E /Y >NUL
IF ERRORLEVEL 1 (
    ECHO Failed to copy themes to "%themes_dest%".
    PAUSE
    EXIT /B 1
)
ECHO Extraction complete.

:: **6. Cleanup**
ECHO Cleaning up...
RD /S /Q "%temp_dir%"
IF ERRORLEVEL 1 (
    ECHO Failed to clean up temporary files.
    PAUSE
    EXIT /B 1
)
ECHO Cleanup complete.

:: **7. Completion Message**
ECHO bmods installation complete!
PAUSE

ENDLOCAL
EXIT /B 0
