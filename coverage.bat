@echo off
if exist TestResults rmdir /s /q TestResults
if exist CoverageReport rmdir /s /q CoverageReport

dotnet test --collect:"XPlat Code Coverage" --results-directory "TestResults"

reportgenerator -reports:TestResults\**\coverage.cobertura.xml -targetdir:CoverageReport -reporttypes:Html

start CoverageReport/index.html