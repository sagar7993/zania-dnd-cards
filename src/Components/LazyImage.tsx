import { FC, ReactElement, Fragment, ImgHTMLAttributes, useState } from 'react';

export const LazyImage: FC<ImgHTMLAttributes<Element> & {
	renderFallback?: () => ReactElement;
	hideImageDuringLoading?: boolean;
}> = ({ renderFallback, hideImageDuringLoading, ...rest }) => {
	const [loading, setLoading] = useState(true);

	return (
		<Fragment>
			{loading && typeof renderFallback === 'function' && renderFallback()}
			<img
				{...rest}
				alt={rest.alt ?? ''}
				onLoad={() => setLoading(false)}
				onError={() => setLoading(true)}
				style={{ ...rest.style, display: (loading && hideImageDuringLoading) ? 'none' : rest.style?.display }}
			/>
		</Fragment>
	);
};
