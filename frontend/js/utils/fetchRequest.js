export const fetchRequestPost = async (pack, route) => {
    const response = await fetch(route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pack),
    });

    return await response.json();
};

export const fetchRequestAuthGet = async (token, route) => {
    const response = await fetch(route, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await response.json();
};

export const fetchRequestAuthPost = async (pack, route, token) => {
    const response = await fetch(route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pack),
    });

    return await response.json();
};
