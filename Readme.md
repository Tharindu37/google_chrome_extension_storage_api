1. Storing Data
```
chrome.storage.local.set({ key: "value" }, function () {
  console.log("Data is stored locally.");
});
```
```
chrome.storage.local.set({ key1: "value1", key2: "value2" }, function () {
  console.log("Data is stored locally.");
});
```

2. Retrieving Data
```
chrome.storage.local.get(["key"], function (result) {
  console.log("Value currently is " + result.key);
});
```
```
chrome.storage.local.get(["key1", "key2"], function (result) {
  console.log("Value 1: " + result.key1);
  console.log("Value 2: " + result.key2);
});
```

3. Removing Data
```
chrome.storage.local.remove(["key"], function () {
  console.log("Data is removed.");
});
```
```
chrome.storage.local.clear(function () {
  console.log("All data is cleared.");
});
```

4. Syncing Data Across Devices
```
chrome.storage.sync.set({ key: "value" }, function () {
  console.log("Data is stored in sync storage.");
});

chrome.storage.sync.get(["key"], function (result) {
  console.log("Value currently is " + result.key);
});
```

5. Example
```
// Save a user setting
function saveUserSetting(settingKey, settingValue) {
  let setting = {};
  setting[settingKey] = settingValue;
  chrome.storage.local.set(setting, function () {
    console.log(`${settingKey} is saved with value: ${settingValue}`);
  });
}

// Retrieve a user setting
function getUserSetting(settingKey, callback) {
  chrome.storage.local.get([settingKey], function (result) {
    callback(result[settingKey]);
  });
}

// Example usage
saveUserSetting("theme", "dark");

getUserSetting("theme", function (value) {
  console.log("User theme setting is: " + value);
});
```