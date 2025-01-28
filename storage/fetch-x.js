(() => {
    window.fetchX = {
        json: async (url, options) => {
            try {
                const response = await fetch(url, options);
                const data = await response.json()

                if (response.ok === false) throw new Error(JSON.stringify(data));

                window.dispatchEvent(new CustomEvent('fetch-x.success', { detail: {
                    response,
                    data,
                    url,
                    options,
                    method: options?.method ?? 'GET'
                } }));

                return data;
            } catch (error) {
                window.dispatchEvent(new CustomEvent('fetch-x.error', { detail: {
                    error,
                    url,
                    options,
                    method: options?.method ?? 'GET'
                } }));

                console.error(error);
            }
        },
        jsonParams: async (url, params, options) => fetchX.json(`${url}?${new URLSearchParams(params).toString()}`, options),
        jsonSubmitData: async (event, body) => {
            event.preventDefault();

            const form = event.target;
            const url = form.action;
            const method = form.getAttribute('method');

            const options = { method }

            if (Object.keys(body).length > 0) options.body = JSON.stringify(body);

            try {
                const response = await fetch(url, options);
                const data = await response.json();

                if (response.ok === false) throw new Error(JSON.stringify(data));

                window.dispatchEvent(new CustomEvent('fetch-x.success', { detail: {
                    response,
                    data,
                    event,
                    form,
                    url,
                    method,
                    body,
                    options,
                } }));

                return data
            } catch (error) {
                window.dispatchEvent(new CustomEvent('fetch-x.error', { detail: {
                    error,
                    form,
                    url,
                    method,
                    body,
                    options,
                } }));

                console.error(error);
            }
        },
        jsonSubmit: async event => {
            const body = Object.fromEntries(new FormData(event.target));

            return await fetchX.jsonSubmitData(event, body);
        },
    }
})()

