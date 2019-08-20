/**
 * 入参
 * @param x: 矩形x的坐标
 * @param y: 矩形y的坐标
 * @param text: 矩形框内的内容
 */
interface IProps {
  x: number;
  y: number;
  text?: undefined | string;
}

export const RectSvg = (props: IProps) => {
  const { x, y, text } = props;
  const rectCoordinate = {};
};
