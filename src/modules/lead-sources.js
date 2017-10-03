export default function leadSources() {
    const utmFields = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
    ];
    if (window) {
        const query = window.location.search.replace('?', '');
        const fields = query.split('&');
        return fields
            .map(field => field.split('='))
            .filter(field => {
                const [name] = field;
                return utmFields.includes(name);
            })
            .reduce((data, field) => {
                let [name, value = null] = field;
                name = name.replace('utm_', '');
                data[name] = value;
                return data;
            }, {});
    }
    return {};
}
