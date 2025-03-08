import React from "react";
import { IconBaseProps } from "react-icons/lib";
import * as LuIcon from "react-icons/lu";
import * as PiIcon from "react-icons/pi";
import { match, P } from "ts-pattern";

export type IconName = keyof typeof LuIcon | keyof typeof PiIcon;

export type IconProps = IconBaseProps & {
  name: IconName;
};

export function Icon({ name, ...props }: IconProps) {
  const element = match(name)
    .with(P.string.startsWith("Lu"), (icon) => LuIcon[icon])
    .with(P.string.startsWith("Pi"), (icon) => PiIcon[icon])
    .otherwise(() => React.Fragment);

  return React.createElement(element, props);
}
