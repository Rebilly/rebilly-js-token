export default function leadSources() {
    const utmFields = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
    ];
    const prefix = 'utm_';
    let leadSource = null;

    if (window) {
        const query = window.location.search.replace('?', '');
        const fields = query.split('&');
        leadSource = fields
            .map(field => field.split('='))
            .filter(field => {
                const [name] = field;
                return utmFields.includes(name);
            })
            .reduce((data, field) => {
                let [name, value = null] = field;
                name = name.replace(prefix, '');
                data[name] = value;
                return data;
            }, {});

    }
    return {leadSource};
}
