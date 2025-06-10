import type React from 'react';

import { genFocusStyle, resetComponent } from '../../style';
import { initFadeMotion, initZoomMotion } from '../../style/motion';
import type { GlobalToken } from '../../theme';
import type { AliasToken, FullToken, GenerateStyle } from '../../theme/internal';
import { genStyleHooks, mergeToken } from '../../theme/internal';
import type { GenStyleFn, TokenWithCommonCls } from '../../theme/util/genComponentStyleHook';
import { unit } from '@ant-design/cssinjs';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  // Component token here
  /**
   * @desc 顶部背景色
   * @descEN Background color of header
   */
  headerBg: string;
  /**
   * @desc 标题行高
   * @descEN Line height of title
   */
  titleLineHeight: number;
  /**
   * @desc 标题字体大小
   * @descEN Font size of title
   */
  titleFontSize: number;
  /**
   * @desc 标题字体颜色
   * @descEN Font color of title
   */
  titleColor: string;
  /**
   * @desc 内容区域背景色
   * @descEN Background color of content
   */
  contentBg: string;
  /**
   * @desc 底部区域背景色
   * @descEN Background color of footer
   */
  footerBg: string;

  /** @internal */
  closeBtnHoverBg: string;
  /** @internal */
  closeBtnActiveBg: string;
  /** @internal */
  contentPadding: number | string;
  /** @internal */
  headerPadding: string | number;
  /** @internal */
  headerBorderBottom: string;
  /** @internal */
  headerMarginBottom: number;
  /** @internal */
  bodyPadding: number;
  /** @internal */
  footerPadding: string | number;
  /** @internal */
  footerBorderTop: string;
  /** @internal */
  footerBorderRadius: string | number;
  /** @internal */
  footerMarginTop: string | number;
  /** @internal */
  confirmBodyPadding: string | number;
  /** @internal */
  confirmIconMarginInlineEnd: string | number;
  /** @internal */
  confirmBtnsMarginTop: string | number;
}

export interface ModalToken extends FullToken<'Modal'> {
  // Custom token here
  modalHeaderHeight: number | string;
  modalFooterBorderColorSplit: string;
  modalFooterBorderStyle: string;
  modalFooterBorderWidth: number;
  modalIconHoverColor: string;
  modalCloseIconColor: string;
  modalCloseBtnSize: number | string;
  modalConfirmIconSize: number | string;
  modalTitleHeight: number | string;
}

function box(position: React.CSSProperties['position']): React.CSSProperties {
  return {
    position,
    inset: 0,
  };
}

export const genModalMaskStyle: GenerateStyle<TokenWithCommonCls<AliasToken>> = (token) => {
  const { componentCls, antCls } = token;

  return [
    {
      [`${componentCls}-root`]: {
        [`${componentCls}${antCls}-zoom-enter, ${componentCls}${antCls}-zoom-appear`]: {
          // reset scale avoid mousePosition bug
          transform: 'none',
          opacity: 0,
          animationDuration: token.motionDurationSlow,
          // https://github.com/ant-design/ant-design/issues/11777
          userSelect: 'none',
        },

        // https://github.com/ant-design/ant-design/issues/37329
        // https://github.com/ant-design/ant-design/issues/40272
        [`${componentCls}${antCls}-zoom-leave ${componentCls}-content`]: {
          pointerEvents: 'none',
        },

        [`${componentCls}-mask`]: {
          ...box('fixed'),
          zIndex: token.zIndexPopupBase,
          height: '100%',
          backgroundColor: token.colorBgMask,
          pointerEvents: 'none',

          [`${componentCls}-hidden`]: {
            display: 'none',
          },
        },

        [`${componentCls}-wrap`]: {
          ...box('fixed'),
          zIndex: token.zIndexPopupBase,
          overflow: 'auto',
          outline: 0,
          WebkitOverflowScrolling: 'touch',
        },
      },
    },
    { [`${componentCls}-root`]: initFadeMotion(token) },
  ];
};

const genModalStyle: GenerateStyle<ModalToken> = (token) => {
  const { componentCls } = token;

  return [
    // ======================== Root =========================
    {
      [`${componentCls}-root`]: {
        [`${componentCls}-wrap-rtl`]: {
          direction: 'rtl',
        },

        [`${componentCls}-centered`]: {
          textAlign: 'center',

          '&::before': {
            display: 'inline-block',
            width: 0,
            height: '100%',
            verticalAlign: 'middle',
            content: '""',
          },
          [componentCls]: {
            top: 0,
            display: 'inline-block',
            paddingBottom: 0,
            textAlign: 'start',
            verticalAlign: 'middle',
          },
        },

        [`@media (max-width: ${token.screenSMMax}px)`]: {
          [componentCls]: {
            maxWidth: 'calc(100vw - 16px)',
            margin: `${unit(token.marginXS)} auto`,
          },
          [`${componentCls}-centered`]: {
            [componentCls]: {
              flex: 1,
            },
          },
        },
      },
    },

    // ======================== Modal ========================
    {
      [componentCls]: {
        ...resetComponent(token),
        pointerEvents: 'none',
        position: 'relative',
        top: 100,
        width: 'auto',
        maxWidth: `calc(100vw - ${unit(token.calc(token.margin).mul(2).equal())})`,
        margin: '0 auto',
        paddingBottom: token.paddingLG,

        [`${componentCls}-title`]: {
          margin: 0,
          color: token.titleColor,
          fontWeight: token.fontWeightStrong,
          fontSize: token.titleFontSize,
          lineHeight: token.titleLineHeight,
          wordWrap: 'break-word',
        },

        [`${componentCls}-content`]: {
          position: 'relative',
          backgroundColor: token.contentBg,
          backgroundClip: 'padding-box',
          border: 0,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadow,
          pointerEvents: 'auto',
          padding: token.contentPadding,
        },

        [`${componentCls}-close`]: {
          position: 'absolute',
          top: token.calc(token.modalHeaderHeight).sub(token.modalCloseBtnSize).div(2).equal(),
          insetInlineEnd: token
            .calc(token.modalHeaderHeight)
            .sub(token.modalCloseBtnSize)
            .div(2)
            .equal(),
          zIndex: token.calc(token.zIndexPopupBase).add(10).equal(),
          padding: 0,
          color: token.modalCloseIconColor,
          fontWeight: token.fontWeightStrong,
          lineHeight: 1,
          textDecoration: 'none',
          background: 'transparent',
          borderRadius: token.borderRadiusSM,
          width: token.modalCloseBtnSize,
          height: token.modalCloseBtnSize,
          border: 0,
          outline: 0,
          cursor: 'pointer',
          transition: `color ${token.motionDurationMid}, background-color ${token.motionDurationMid}`,

          '&-x': {
            display: 'flex',
            fontSize: token.fontSizeLG,
            fontStyle: 'normal',
            lineHeight: `${unit(token.modalCloseBtnSize)}`,
            justifyContent: 'center',
            textTransform: 'none',
            textRendering: 'auto',
          },

          '&:hover': {
            color: token.modalIconHoverColor,
            backgroundColor: token.closeBtnHoverBg,
            textDecoration: 'none',
          },

          '&:active': {
            backgroundColor: token.closeBtnActiveBg,
          },

          ...genFocusStyle(token),
        },

        [`${componentCls}-header`]: {
          color: token.colorText,
          background: token.headerBg,
          borderRadius: `${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)} 0 0`,
          marginBottom: token.headerMarginBottom,
          padding: token.headerPadding,
          borderBottom: token.headerBorderBottom,
          cursor: 'default',
        },

        [`${componentCls}-body`]: {
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          wordWrap: 'break-word',
          padding: token.bodyPadding,
        },

        [`${componentCls}-footer`]: {
          textAlign: 'end',
          background: token.footerBg,
          marginTop: token.footerMarginTop,
          padding: token.footerPadding,
          borderTop: token.footerBorderTop,
          borderRadius: token.footerBorderRadius,

          [`> ${token.antCls}-btn + ${token.antCls}-btn`]: {
            marginInlineStart: token.marginXS,
          },
        },

        [`${componentCls}-open`]: {
          overflow: 'hidden',
        },
      },
    },

    // ======================== Pure =========================
    {
      [`${componentCls}-pure-panel`]: {
        top: 'auto',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',

        [`${componentCls}-content,
          ${componentCls}-body,
          ${componentCls}-confirm-body-wrapper`]: {
          display: 'flex',
          flexDirection: 'column',
          flex: 'auto',
        },

        [`${componentCls}-confirm-body`]: {
          marginBottom: 'auto',
        },
      },
    },
  ];
};

const genModalResizeStyle: GenerateStyle<ModalToken> = (token) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-resize-wrapper`]: {
      position: 'static !important' as any,
      inset: 'auto !important' as any,
      padding: '0 !important' as any,
      overflow: 'visible !important' as any,

      [componentCls]: {
        position: 'static !important' as any,
        top: 'auto !important' as any,
        margin: '0 !important' as any,
        padding: '0 !important' as any,
        maxWidth: 'none !important' as any,
        width: '100% !important' as any,
        height: '100% !important' as any,

        [`${componentCls}-content`]: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },

        [`${componentCls}-body`]: {
          flex: 1,
          overflow: 'auto',
        },

        [`${componentCls}-header`]: {
          cursor: 'move',
          userSelect: 'none',
          flexShrink: 0,
        },

        [`${componentCls}-footer`]: {
          flexShrink: 0,
        },
      },
    },

    // Resize handles styles for react-rnd
    '.rnd-resize-handle': {
      position: 'absolute',
      zIndex: 10,
    },

    '.rnd-resize-handle-top': {
      top: '-3px',
      left: '10px',
      right: '10px',
      height: '6px',
      cursor: 'n-resize',
    },

    '.rnd-resize-handle-right': {
      top: '10px',
      right: '-3px',
      bottom: '10px',
      width: '6px',
      cursor: 'e-resize',
    },

    '.rnd-resize-handle-bottom': {
      bottom: '-3px',
      left: '10px',
      right: '10px',
      height: '6px',
      cursor: 's-resize',
    },

    '.rnd-resize-handle-left': {
      top: '10px',
      left: '-3px',
      bottom: '10px',
      width: '6px',
      cursor: 'w-resize',
    },

    '.rnd-resize-handle-top-left': {
      top: '-3px',
      left: '-3px',
      width: '12px',
      height: '12px',
      cursor: 'nw-resize',
    },

    '.rnd-resize-handle-top-right': {
      top: '-3px',
      right: '-3px',
      width: '12px',
      height: '12px',
      cursor: 'ne-resize',
    },

    '.rnd-resize-handle-bottom-left': {
      bottom: '-3px',
      left: '-3px',
      width: '12px',
      height: '12px',
      cursor: 'sw-resize',
    },

    '.rnd-resize-handle-bottom-right': {
      bottom: '-3px',
      right: '-3px',
      width: '12px',
      height: '12px',
      cursor: 'se-resize',
    },

    // Also support default react-resizable handles
    '.react-resizable-handle': {
      position: 'absolute',
      zIndex: 10,
      opacity: 0,
      transition: 'opacity 0.2s ease',

      '&:hover': {
        opacity: 1,
      },
    },

    '.react-resizable-handle-se': {
      bottom: '0px',
      right: '0px',
      cursor: 'se-resize',
      width: '20px',
      height: '20px',
    },

    '.react-resizable-handle-s': {
      bottom: '0px',
      left: '50%',
      marginLeft: '-10px',
      cursor: 's-resize',
      width: '20px',
      height: '10px',
    },

    '.react-resizable-handle-e': {
      right: '0px',
      top: '50%',
      marginTop: '-10px',
      cursor: 'e-resize',
      width: '10px',
      height: '20px',
    },

    '.react-resizable-handle-n': {
      top: '0px',
      left: '50%',
      marginLeft: '-10px',
      cursor: 'n-resize',
      width: '20px',
      height: '10px',
    },

    '.react-resizable-handle-w': {
      left: '0px',
      top: '50%',
      marginTop: '-10px',
      cursor: 'w-resize',
      width: '10px',
      height: '20px',
    },

    '.react-resizable-handle-ne': {
      top: '0px',
      right: '0px',
      cursor: 'ne-resize',
      width: '20px',
      height: '20px',
    },

    '.react-resizable-handle-nw': {
      top: '0px',
      left: '0px',
      cursor: 'nw-resize',
      width: '20px',
      height: '20px',
    },

    '.react-resizable-handle-sw': {
      bottom: '0px',
      left: '0px',
      cursor: 'sw-resize',
      width: '20px',
      height: '20px',
    },

    // Visual indicators for resize handles
    '.react-resizable-handle:after': {
      content: '""',
      position: 'absolute',
      right: '3px',
      bottom: '3px',
      width: '5px',
      height: '5px',
      borderRight: `2px solid ${token.colorBorder}`,
      borderBottom: `2px solid ${token.colorBorder}`,
    },
  };
};

const genRTLStyle: GenerateStyle<ModalToken> = (token) => {
  const { componentCls } = token;
  return {
    [`${componentCls}-root`]: {
      [`${componentCls}-wrap-rtl`]: {
        direction: 'rtl',

        [`${componentCls}-confirm-body`]: {
          direction: 'rtl',
        },
      },
    },
  };
};

// ============================== Export ==============================
export const prepareToken: (token: Parameters<GenStyleFn<'Modal'>>[0]) => ModalToken = (token) => {
  const headerPaddingVertical = token.padding;
  const headerFontSize = token.fontSizeHeading5;
  const headerLineHeight = token.lineHeightHeading5;

  const modalToken = mergeToken<ModalToken>(token, {
    modalHeaderHeight: token
      .calc(token.calc(headerLineHeight).mul(headerFontSize).equal())
      .add(token.calc(headerPaddingVertical).mul(2).equal())
      .equal(),
    modalFooterBorderColorSplit: token.colorSplit,
    modalFooterBorderStyle: token.lineType,
    modalFooterBorderWidth: token.lineWidth,
    modalIconHoverColor: token.colorIconHover,
    modalCloseIconColor: token.colorIcon,
    modalCloseBtnSize: token.fontHeight,
    modalConfirmIconSize: token.fontHeight,
    modalTitleHeight: token.calc(token.titleFontSize).mul(token.titleLineHeight).equal(),
  });

  return modalToken;
};

export const prepareComponentToken = (token: GlobalToken) => ({
  footerBg: 'transparent',
  headerBg: token.colorBgElevated,
  titleLineHeight: token.lineHeightHeading5,
  titleFontSize: token.fontSizeHeading5,
  contentBg: token.colorBgElevated,
  titleColor: token.colorTextHeading,

  // internal
  closeBtnHoverBg: token.wireframe ? 'transparent' : token.colorFillContent,
  closeBtnActiveBg: token.wireframe ? 'transparent' : token.colorFillContentHover,
  contentPadding: token.wireframe
    ? 0
    : `${unit(token.paddingMD)} ${unit(token.paddingContentHorizontalLG)}`,
  headerPadding: token.wireframe ? `${unit(token.padding)} ${unit(token.paddingLG)}` : 0,
  headerBorderBottom: token.wireframe
    ? `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`
    : 'none',
  headerMarginBottom: token.wireframe ? 0 : token.marginXS,
  bodyPadding: token.wireframe ? token.paddingLG : 0,
  footerPadding: token.wireframe ? `${unit(token.paddingXS)} ${unit(token.padding)}` : 0,
  footerBorderTop: token.wireframe
    ? `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`
    : 'none',
  footerBorderRadius: token.wireframe
    ? `0 0 ${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)}`
    : 0,
  footerMarginTop: token.wireframe ? 0 : token.marginSM,
  confirmBodyPadding: token.wireframe
    ? `${unit(token.padding * 2)} ${unit(token.padding * 2)} ${unit(token.paddingLG)}`
    : 0,
  confirmIconMarginInlineEnd: token.wireframe ? token.margin : token.marginSM,
  confirmBtnsMarginTop: token.wireframe ? token.marginLG : token.marginSM,
});

export default genStyleHooks(
  'Modal',
  (token) => {
    const modalToken = prepareToken(token);

    return [
      genModalStyle(modalToken),
      genModalResizeStyle(modalToken),
      genRTLStyle(modalToken),
      genModalMaskStyle(modalToken),
      initZoomMotion(modalToken, 'zoom'),
    ];
  },
  prepareComponentToken,
  {
    unitless: {
      titleLineHeight: true,
    },
  },
);
