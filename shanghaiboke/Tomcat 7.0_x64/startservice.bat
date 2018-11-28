@echo off
rem @echo Mysql startup ...
%~d0
echo.
cd %~dp0
echo.
@echo exit

@echo off
if "%OS%" == "Windows_NT" setlocal
rem ---------------------------------------------------------------------------
rem Start script for the CATALINA Server
rem
rem $Id: startup.bat,v 1.6 2004/05/27 18:25:11 yoavs Exp $
rem ---------------------------------------------------------------------------

rem %cd%
echo %cd%
echo %~dp0
set CATALINA_HOME=%cd%

set JAVA_HOME=%cd%\jre1.8.0_60_x64
set JAVA_OPTS=-server -Xms1024m -Xmx2048m

rem set JAVA_OPTS=-server -Xms512m -Xmx512m
rem set SYS_PATH=%CATALINA_HOME%\webapps\map
set EXECUTABLE=%CATALINA_HOME%\bin\startup.bat

rem Check that target executable exists
if exist "%EXECUTABLE%" goto okExec
echo Cannot find %EXECUTABLE%
echo This file is needed to run this program
goto end
:okExec

rem Get remaining unshifted command line arguments and save them in the
set CMD_LINE_ARGS=
:setArgs
if ""%1""=="""" goto doneSetArgs
set CMD_LINE_ARGS=%CMD_LINE_ARGS% %1
shift
goto setArgs
:doneSetArgs

echo cd %CATALINA_HOME%\bin
echo tomcat5.exe %CMD_LINE_ARGS%
echo "%EXECUTABLE%"
call "%EXECUTABLE%" start %CMD_LINE_ARGS%

:end
exit