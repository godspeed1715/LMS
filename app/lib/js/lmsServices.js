'use strict';

/* Services */

angular.module('lms.services', [])
    .service('lmsService', function() {
        $.support.cors = true;

        //Set private this variable
        var _this = this;
	  
        //Create ActiveX File System object 
        //IE HTA service to manipulate local user data.
        var oFileSystem = new ActiveXObject("Scripting.FileSystemObject");

        //Set User lms data folder.  
        var objShell = new ActiveXObject("WScript.Shell")
        oUserProfilePath = objShell.ExpandEnvironmentStrings("%APPDATA%");
        userProfilePathRaw = objShell.ExpandEnvironmentStrings("%APPDATA%").split('\\');
        userProfilePath = '/';
        for (var _userpath = 1; _userpath < userProfilePathRaw.length; _userpath++) {
            userProfilePath += userProfilePathRaw[_userpath] + "/"
        }
       
        //Get the root directory of the editor.
        _this.locateRootDirectory = function() {
            rootDirectory = "";
            pathname = location.pathname.split('\\');
            for (var _path = 0; _path < pathname.length - 1; _path++) {
                rootDirectory += pathname[_path] + "\\"
            }
            return rootDirectory
        }

        //Init the local config file. Will check if config exist, and if it does not, then sets lms defaults.
        var initUserConfig = function() {
            var configFolderPath = oUserProfilePath + "\\lms"
            var configFilePath = configFolderPath + "\\config.lms.settings";
            var bConfigFolderExist = oFileSystem.FolderExists(oUserProfilePath + "\\lms");
            var bConfigFileExist = oFileSystem.FileExists(configFolderPath + "\\config.lms.settings");
            var ajaxPath = userProfilePath + 'lms/config.lms.settings';
            try {
                if (bConfigFolderExist) {
                    if (bConfigFileExist) {
                        return ajaxPath
                    } else {
                        var configFile = oFileSystem.CreateTextFile(configFilePath, true);
                        configFile.write("{\n\t\"ConfigItem\": \"ConfigData\"}")
                        return ajaxPath
                    }
                } else {
                    try {
                        console.log('Config Folder does not exist, creating ' + oUserProfilePath)
                        oFileSystem.CreateFolder(oUserProfilePath + "\\lms");
                        if (bConfigFileExist) {
                            return ajaxPath
                        } else {
                            var configFile = oFileSystem.CreateTextFile(configFilePath, true);
                            configFile.write("{\n\t\"ConfigItem\": \"ConfigData\"}")                           
                            return ajaxPath
                        }
                    } catch (e) {
                        console.log(e)
                        console.error('Configuration file could not be found nor created, reverting to default configuration.')
                    }
                }
            } catch (e) {
                console.log(e)
                console.error('Configuration folder could not be found nor created, reverting to default configuration.')
            }
        }

        //Loads the local Config file
        this.loadUserConfig = function(configFile) {
            var configFile = initUserConfig();
            console.log('AJAX Request: Loading User Configuration: ' + configFile)
            var promise = $.getJSON(configFile, function(responseData) {
                console.log('Loaded config successfully');
                data = responseData
                return data
            }).error(function(e) {
                console.log("Unable to Load Config File. Error: " + JSON.stringify(e));
            });

            return promise;
        };
    });