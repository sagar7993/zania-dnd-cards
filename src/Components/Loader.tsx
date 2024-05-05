import { Box } from '@mui/material';
import { FC } from 'react';

import '../Styles/loader.css';

export const Loader: FC<{ variant?: 'contained'; color?: string; strokeWidth?: number }> = ({ variant, color, strokeWidth } = {}) => {
	return (
		<Box className="global-loader-container">
			<Box
				className="global-loader"
				style={{
					color,
					height: variant === 'contained' ? '100%' : undefined,
					width: variant === 'contained' ? '100%' : undefined
				}}
			>
				{Array.from({ length: 4 }).map((_, index) => (
					<Box
						key={index}
						style={{
							height: variant === 'contained' ? '80%' : undefined,
							width: variant === 'contained' ? '80%' : undefined,
							borderWidth: typeof strokeWidth === 'number' ? `${strokeWidth}px` : undefined,
							margin: typeof strokeWidth === 'number' ? `${strokeWidth}px` : undefined
						}}
					/>
				))}
			</Box>
		</Box>
	);
};