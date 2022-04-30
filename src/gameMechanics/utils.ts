export const toDictIndexedBy = <
	O extends object,
	KGetter extends (o: O) => string
>(
	list: O[],
	getKey: KGetter
) =>
	list.reduce(
		(prev, next) => ({
			...prev,
			[getKey(next)]: next
		}),
		{} as { [k: string]: O }
	);
