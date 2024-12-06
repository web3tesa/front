import { base } from './base'

export default function Base() {
    return (
        <img
            src={base}
            style={{
                borderRadius: '50%',
            }}
            width={42}
            height={42}
            alt=""
        />
    )
}