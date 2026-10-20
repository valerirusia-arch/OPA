// src/shared/ui/ResponsiveModal.tsx
//
// ONE DIALOG, TWO SHAPES, DECIDED BY THE SCREEN.
//
// A centred Modal is right on a desktop and wrong on a phone: it opens in the
// middle with the keyboard and the thumb both far from it, margins down the
// sides, and content that has to shrink to fit a box floating in space. The
// phone-native shape is a bottom sheet — anchored to the foot of the screen,
// full width, rising into view, reachable by the thumb — *"მიხვიდ ქვემოდან
// უნდა მოვიდეს, გვერდებზე მთლიანად შევსებული, მაღლა ამოდის, უფრო პრაქტიკულია
// ტელეფონზე."*
//
// So this is a drop-in for antd's Modal that renders the same content as a
// `Drawer placement="bottom"` below the tablet breakpoint and as a Modal above
// it. The call site keeps one set of props; the surface follows the viewport.
// antd both ways — Modal and Drawer are the same library's two dialog shapes,
// and the bottom sheet is exactly what Drawer's bottom placement is for.
//
// Dumb: it renders what it is handed and reports close through onCancel.

import type { CSSProperties, ReactNode } from "react";
import { Button, Drawer, Grid, Modal, theme } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useT } from "./i18n/useT";
import { styles } from "./ResponsiveModal.styles";

/** The semantic-DOM slots both surfaces expose, so a caller can style the body
 *  (or header/footer/content) the same way it would on a Modal. */
type SlotStyles = {
  body?: CSSProperties;
  header?: CSSProperties;
  footer?: CSSProperties;
  content?: CSSProperties;
};

export type ResponsiveModalProps = {
  open: boolean;
  onCancel?: () => void;
  title?: ReactNode;
  /** `null` suppresses the footer bar on both surfaces (the content carries its
   *  own actions, as the app's dialogs do). */
  footer?: ReactNode;
  /** Desktop dialog width; ignored on the phone sheet, which is full width. */
  width?: number;
  /** Desktop only — the sheet is always anchored to the foot of the screen. */
  centered?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnHidden?: boolean;
  styles?: SlotStyles;
  children?: ReactNode;
};

export function ResponsiveModal({
  open,
  onCancel,
  title,
  footer,
  width,
  centered,
  closable,
  maskClosable,
  destroyOnHidden,
  styles: slot,
  children,
}: ResponsiveModalProps) {
  const t = useT();
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  // Phones get the sheet; tablet and up keep the centred dialog. `md === false`
  // rather than `!screens.md`, so the first paint — before any breakpoint has
  // resolved and every flag is undefined — is treated as desktop, not mobile.
  const asSheet = screens.md === false;

  if (asSheet) {
    /* The grab handle the references draw: a short bar centred at the very top
       of the sheet that says "drag me down to dismiss". Absolutely placed so it
       is centred across the whole width whatever sits in the header, and it
       rides in the title slot above the title text (if any). */
    const handle = <div style={{ ...styles.handle, background: token.colorFill }} />;
    return (
      <Drawer
        placement="bottom"
        open={open}
        onClose={onCancel}
        title={
          <>
            {handle}
            {title}
          </>
        }
        footer={footer ?? undefined}
        /* The close sits top-RIGHT, where it is on the desktop dialog and on
           every sheet a phone user has met, rather than Drawer's default
           top-left. `extra` is the header's right slot; the built-in close
           (left) is turned off. A caller that asked for no close still gets
           none. */
        closable={false}
        extra={
          closable === false ? undefined : (
            <Button
              type="text"
              aria-label={t("common.close")}
              icon={<CloseOutlined />}
              style={styles.sheetClose}
              onClick={onCancel}
            />
          )
        }
        maskClosable={maskClosable}
        destroyOnHidden={destroyOnHidden}
        /* Sizes to its content, capped by the panel's own max-height, so a
           short dialog is a short sheet and a tall one scrolls its body. */
        height="auto"
        styles={{
          content: { ...styles.sheetContent, ...slot?.content },
          header: { ...styles.sheetHeader, ...slot?.header },
          body: { ...styles.sheetBody, ...slot?.body },
          footer: slot?.footer,
        }}
      >
        {children}
      </Drawer>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={title}
      footer={footer}
      width={width}
      centered={centered}
      closable={closable}
      maskClosable={maskClosable}
      destroyOnHidden={destroyOnHidden}
      styles={slot}
    >
      {children}
    </Modal>
  );
}

export default ResponsiveModal;
