const API_BASE = "http://localhost:8080/api/stocks";

function authHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const STOCK_STATUS = {
    NORMAL: "NORMAL",
    CRITICAL: "CRITICAL",
    OUT_OF_STOCK: "OUT_OF_STOCK"
};

export const STOCK_STATUS_LABELS = {
    NORMAL: "Normal",
    CRITICAL: "Kritik",
    OUT_OF_STOCK: "Stokta Yok"
};

export function getStockStatus(item) {
    const quantity = Number(item.quantity);
    const minimumQuantity = Number(item.minimumQuantity);

    if (quantity === 0) {
        return STOCK_STATUS.OUT_OF_STOCK;
    }
    if (quantity <= minimumQuantity) {
        return STOCK_STATUS.CRITICAL;
    }
    return STOCK_STATUS.NORMAL;
}

async function handleResponse(response) {
    if (!response.ok) {
        let message = `İstek başarısız oldu (${response.status}).`;
        try {
            const text = await response.text();
            if (text) {
                try {
                    const data = JSON.parse(text);
                    message = data.message || data.error || text;
                } catch {
                    message = text;
                }
            }
        } catch {
            // response body okunamadı, varsayılan mesaj kalır
        }
        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function fetchStocks() {
    let response;
    try {
        response = await fetch(API_BASE, { headers: authHeaders() });
    } catch {
        throw new Error("Backend'e ulaşılamadı. Sunucunun çalıştığından emin olun.");
    }
    return handleResponse(response);
}

export async function createStock({ productName, quantity, minimumQuantity }) {
    let response;
    try {
        response = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ productName, quantity, minimumQuantity })
        });
    } catch {
        throw new Error("Backend'e ulaşılamadı. Sunucunun çalıştığından emin olun.");
    }
    return handleResponse(response);
}

export async function increaseStock(id, quantity) {
    let response;
    try {
        response = await fetch(
            `${API_BASE}/${id}/increase?quantity=${encodeURIComponent(quantity)}`,
            { method: "PUT", headers: authHeaders() }
        );
    } catch {
        throw new Error("Backend'e ulaşılamadı. Sunucunun çalıştığından emin olun.");
    }
    return handleResponse(response);
}

export async function decreaseStock(id, quantity) {
    let response;
    try {
        response = await fetch(
            `${API_BASE}/${id}/decrease?quantity=${encodeURIComponent(quantity)}`,
            { method: "PUT", headers: authHeaders() }
        );
    } catch {
        throw new Error("Backend'e ulaşılamadı. Sunucunun çalıştığından emin olun.");
    }
    return handleResponse(response);
}

export async function deleteStock(id) {
    let response;
    try {
        response = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: authHeaders() });
    } catch {
        throw new Error("Backend'e ulaşılamadı. Sunucunun çalıştığından emin olun.");
    }
    return handleResponse(response);
}
