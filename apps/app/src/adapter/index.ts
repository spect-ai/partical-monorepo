export const cloudflare = async (
  dropletIp: string,
  body: {
    content?: string;
    proxied: boolean;
  }
) => {
  await fetch('/api/cloudflare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export const digitalOcean = async (dropletId: string) => {
  const res = await fetch(
    `https://api.digitalocean.com/v2/droplets/${dropletId}`,
    {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' +
          'dop_v1_1df18291fc295181fb0dc2278faa4a881adecd6e12b5f96a54e732f6f4b27348',
      },
    }
  );
  const json = await res.json();
  if (json.droplet.networks.v4.length > 0) {
    return json.droplet.networks.v4[0].ip_address;
  }
  return null;
};
