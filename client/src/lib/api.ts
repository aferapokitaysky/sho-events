export type FormEndpoint = "partners" | "contact";

export interface FormPayload {
  [key: string]: string | undefined;
}

export async function submitForm(endpoint: FormEndpoint, payload: FormPayload) {
  const res = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}
