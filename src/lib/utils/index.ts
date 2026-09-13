export function toDateInputValue(value: number | bigint | null | undefined): string {
	if (value === null || value === undefined) return '';

	const milliseconds = Number(value);
	return Number.isFinite(milliseconds) ? new Date(milliseconds).toISOString().slice(0, 10) : '';
}
