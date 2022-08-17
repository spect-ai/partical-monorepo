export default async function handler(req, res) {
  const cres = await fetch(
    `https://api.cloudflare.com/client/v4/zones/abdf7cba29a63deebc3cfa5e06958903/dns_records/b1ecbfdd1c9d45dff5332d99eb9609c7`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + 'naUId44GvLklu5A8KUqb1lX3cLmUOPvqBXOH02Ac',
      },
      body: JSON.stringify(req.body),
      credentials: 'include',
    }
  );
  const data = await cres.json();
  res.status(200).json(data);
}
