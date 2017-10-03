import Fingerprint2 from 'fingerprintjs2';

export default function fingerprint() {
    return new Promise((resolve) => {
        const fp = new Fingerprint2({excludeAdBlock: true});
        fp.get((hash => resolve({fingerprint: hash})));
    });
}
