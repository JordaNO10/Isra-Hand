@echo off
REM === תאריך בפורמט YYYY-MM-DD ===
set "DATE=%date:~6,4%-%date:~3,2%-%date:~0,2%"

REM === נתיב המקור והיעד ===
set "SOURCE=C:\wamp64\bin\mysql\mysql9.1.0\data\israhand"
set "DEST=D:\SQL BACKUP\israhand_backup_%DATE%"

REM === יצירת התיקייה אם לא קיימת ===
if not exist "%DEST%" mkdir "%DEST%"

REM === העתקה של כל הקבצים מהמקור ליעד ===
xcopy "%SOURCE%" "%DEST%" /E /H /C /I /Y

echo גיבוי הסתיים בתאריך %DATE%