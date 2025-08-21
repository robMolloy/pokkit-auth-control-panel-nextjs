onTerminate((e) => {
  console.log("[custom hook] PocketBase is shutting down");

  e.next();
});

onRecordCreate((e) => {
  const recordsCount = $app.countRecords("users");
  if (recordsCount === 0) {
    e.record.set("role", "admin");
    e.record.set("status", "approved");
  }

  e.next();
}, "users");

routerAdd("GET", "/get-providers", async (e) => {
  const resp = await $app.findCollectionByNameOrId("users");

  return e.json(200, { message: resp.oauth2?.providers?.map((x) => x.name) });
});
