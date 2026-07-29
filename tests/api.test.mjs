import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createUmojaServer, validateRequest } from "../server.mjs";

test("validateRequest requires a contact method", () => {
  assert.throws(
    () =>
      validateRequest({
        name: "Ada",
        service: "Residential cleaning",
        property: "Home"
      }),
    /Phone or email is required/
  );
});

test("request API creates, lists, and updates requests", async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "umoja-api-"));
  t.after(() => rm(dir, { recursive: true, force: true }));

  const server = createUmojaServer({
    root: path.resolve("."),
    requestsFile: path.join(dir, "requests.json")
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const createdResponse = await fetch(`${base}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Ada Lovelace",
      phone: "802-555-1000",
      service: "Office and commercial cleaning",
      property: "Office",
      timing: "This week",
      location: "Essex Junction",
      notes: "Lobby and restroom reset."
    })
  });

  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.request.status, "new");
  assert.equal(created.request.name, "Ada Lovelace");

  const listResponse = await fetch(`${base}/api/requests`);
  assert.equal(listResponse.status, 200);
  const list = await listResponse.json();
  assert.equal(list.requests.length, 1);

  const patchResponse = await fetch(`${base}/api/requests/${created.request.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "scheduled" })
  });
  assert.equal(patchResponse.status, 200);
  const patched = await patchResponse.json();
  assert.equal(patched.request.status, "scheduled");
});
