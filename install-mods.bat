@ECHO OFF

:: **1. Customizable Settings** 
SET git_url=https://github.com/RatWasHere/bmods.git
SET steam_install_dir="C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord"
SET actions_dest="%steam_install_dir%\AppData\Actions"
SET themes_dest="%steam_install_dir%\Themes"

:: **2. Downloading the Repository (Requires Git)**
ECHO Downloading bmods repository...
git clone %git_url%

:: **3. Extraction with Specific Destinations**
ECHO Extracting bmods...
xcopy bmods\actions "%actions_dest%" /E /Y
xcopy bmods\themes "%themes_dest%" /E /Y

:: **4. Cleanup (Optional)**
ECHO Cleaning up...
RD /S /Q bmods 

:: **5. Completion Message**
ECHO bmods installation complete!
