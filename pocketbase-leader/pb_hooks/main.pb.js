routerAdd("GET", "/get-providers", async (e) => {
  const resp = await $app.findCollectionByNameOrId("users");

  return e.json(200, { message: resp.oauth2?.providers?.map((x) => x.name) });
});
