import React, { lazy, Suspense, useMemo } from "react";

export interface IconProps {
  name: string;
  width?: string | number;
  height?: string | number;
  color?: string;
  secondColor?: string;
}

export const Icon = ({
                       name,
                       width = 20,
                       height = 20,
                       color = "primary",
                       secondColor = "primary",
                       ...props
                     }: IconProps) => {
  const TheIcon = useMemo(
    () =>
      lazy(() =>
        import(`../../assets/icons/${name?.toLowerCase()}.tsx`).catch((err) => {
            // eslint-disable-next-line no-console
            console.warn("missing state icon: ", err);
            return ({
              default: () => null
            });
          }
        )
      ),
    [name]
  );

  return (
    <Suspense fallback={<span />}>
      <TheIcon
        width={width}
        height={height}
        secondColor={secondColor}
        color={color}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Suspense>
  );
};

export default Icon;
