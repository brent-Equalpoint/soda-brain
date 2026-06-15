/* @ds-bundle: {"format":3,"namespace":"SODADesignSystem_3bd687","components":[{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"ContactRow","sourcePath":"components/data-display/ContactRow.jsx"},{"name":"EventCard","sourcePath":"components/data-display/EventCard.jsx"},{"name":"EventRow","sourcePath":"components/data-display/EventRow.jsx"},{"name":"RolePill","sourcePath":"components/data-display/RolePill.jsx"},{"name":"StatTile","sourcePath":"components/data-display/StatTile.jsx"},{"name":"BottomSheet","sourcePath":"components/feedback/BottomSheet.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"CodeInput","sourcePath":"components/forms/CodeInput.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"ResendControl","sourcePath":"components/forms/ResendControl.jsx"},{"name":"SegmentedToggle","sourcePath":"components/forms/SegmentedToggle.jsx"},{"name":"Carousel","sourcePath":"components/navigation/Carousel.jsx"},{"name":"SectionHeader","sourcePath":"components/navigation/SectionHeader.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"}],"sourceHashes":{"components/data-display/Avatar.jsx":"70dee20724b5","components/data-display/Badge.jsx":"d2285029a8de","components/data-display/ContactRow.jsx":"787b84a6eec7","components/data-display/EventCard.jsx":"7e5490355703","components/data-display/EventRow.jsx":"95f926fbac14","components/data-display/RolePill.jsx":"d156498c9631","components/data-display/StatTile.jsx":"25f4869b6b1a","components/feedback/BottomSheet.jsx":"d0e3858a2b5a","components/feedback/ProgressBar.jsx":"48422abebbda","components/feedback/Toast.jsx":"fb36e3097ad2","components/forms/Button.jsx":"cc40fa4d7722","components/forms/Chip.jsx":"0dba034633ed","components/forms/CodeInput.jsx":"a955ae30ebe1","components/forms/Input.jsx":"2ffe5c048785","components/forms/ResendControl.jsx":"a9e865910ef8","components/forms/SegmentedToggle.jsx":"093b675fb2c0","components/navigation/Carousel.jsx":"b7bc851d5bc4","components/navigation/SectionHeader.jsx":"4e2a6b456109","components/navigation/TabBar.jsx":"fb72ea4c4316","screens/access.jsx":"3a2d1a7723fa","screens/collab.jsx":"45049bf2530f","screens/design-canvas.jsx":"bd8746af6e58","screens/frames.jsx":"cef5d889f961","screens/host.jsx":"d3b271a7c6c4","screens/kit.jsx":"7f0008125535","ui_kits/admin/admin.jsx":"46ecc0eeaf56","ui_kits/admin/panels.jsx":"0c2f2b838be6","ui_kits/admin/tweaks-panel.jsx":"6591467622ed","ui_kits/attendee/home.jsx":"0ef722e29901","ui_kits/attendee/onboarding.jsx":"ad12f1a674d6","ui_kits/attendee/room.jsx":"83aba909c222","ui_kits/attendee/survey.jsx":"3c20663876e2","ui_kits/attendee/ui.jsx":"0d1b00189dd5","ui_kits/command-center/cc.jsx":"cb4ca5de8350","ui_kits/command-center/views.jsx":"305ce54685da"},"inlinedExternals":[],"unexposedExports":[{"name":"initialsOf","sourcePath":"components/data-display/Avatar.jsx"}]} */

(() => {

const __ds_ns = (window.SODADesignSystem_3bd687 = window.SODADesignSystem_3bd687 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data-display/Avatar.jsx
try { (() => {
const AV_PALETTE = ['--av-1', '--av-2', '--av-3', '--av-4', '--av-5', '--av-6', '--av-7', '--av-8'];
function initialsOf(name = '') {
  return name.trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
}
function colorFor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) >>> 0;
  return `var(${AV_PALETTE[h % AV_PALETTE.length]})`;
}

/**
 * SODA Avatar — a circular identity mark. If `src` is given it shows the
 * photo; otherwise it falls back to white initials on a deterministic
 * color from the 8-color identity palette (stable per name).
 */
function Avatar({
  name = '',
  src = null,
  size = 48,
  color,
  style = {}
}) {
  const bg = color || colorFor(name);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.38),
      color: '#fff',
      background: src ? `center/cover no-repeat url(${src})` : bg,
      overflow: 'hidden',
      userSelect: 'none',
      ...style
    },
    "aria-label": name
  }, !src && initialsOf(name));
}
Object.assign(__ds_scope, { initialsOf, Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
/**
 * SODA Badge — a small pill. Two roles:
 *  - status: 'built' | 'spec' (documentation status)
 *  - signal: 'reached' | 'nudge' | 'saved' | 'just' (contact follow-up state)
 * Pass either `status` or `signal`, or a freeform `tone`.
 */
function Badge({
  children,
  tone = 'neutral',
  status,
  signal,
  dot = false,
  style = {}
}) {
  const TONES = {
    neutral: {
      color: 'var(--text-muted)',
      background: 'var(--surface-2)'
    },
    green: {
      color: 'var(--accent)',
      background: 'var(--accent-soft)'
    },
    purple: {
      color: 'var(--private)',
      background: 'var(--private-soft)'
    },
    amber: {
      color: 'var(--warn)',
      background: 'var(--warn-soft)'
    },
    yellow: {
      color: 'var(--pending)',
      background: 'rgba(255,210,63,0.12)'
    },
    danger: {
      color: 'var(--danger)',
      background: 'var(--danger-soft)'
    }
  };
  const STATUS = {
    built: 'green',
    spec: 'yellow'
  };
  const SIGNAL = {
    reached: 'green',
    nudge: 'purple',
    saved: 'neutral',
    just: 'neutral'
  };
  const key = status ? STATUS[status] : signal ? SIGNAL[signal] : tone;
  const t = TONES[key] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      padding: '4px 9px',
      borderRadius: 'var(--r-pill)',
      whiteSpace: 'nowrap',
      ...t,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/ContactRow.jsx
try { (() => {
/**
 * SODA ContactRow — a person in a list: avatar, name, a mono met-at
 * line, an optional warmth dot, and a trailing signal badge. The unit
 * of the Room View, the rolodex, and "people you met".
 */
function ContactRow({
  name,
  role,
  metAt,
  signal,
  warmthColor,
  src,
  onClick,
  boxed = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: boxed ? '11px 13px' : '7px 0',
      background: boxed ? 'var(--surface-1)' : 'transparent',
      border: boxed ? '1px solid var(--border)' : 'none',
      borderRadius: boxed ? 'var(--r-md)' : 0,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color var(--dur-fast) var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    src: src,
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)',
      lineHeight: 1.1
    }
  }, name), metAt && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      marginTop: 2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, role ? `${role} · ${metAt}` : metAt)), warmthColor && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: warmthColor
    }
  }), signal && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    signal: signal
  }, {
    reached: 'Reached out',
    nudge: 'Reach out',
    saved: 'Saved',
    just: 'Just met'
  }[signal]));
}
Object.assign(__ds_scope, { ContactRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/ContactRow.jsx", error: String((e && e.message) || e) }); }

// components/data-display/EventCard.jsx
try { (() => {
/**
 * SODA EventCard — an event in the Home. Two layouts:
 *  - 'strip' (default): a compact fixed-width card for the horizontal
 *    "recent events" strip — host eyebrow, name, date · N met.
 *  - 'row': a full-width list row with a logo tile and a green met count.
 */
function EventCard({
  host,
  name,
  date,
  where,
  met,
  recap,
  variant = 'strip',
  onClick
}) {
  if (variant === 'row') {
    const logo = host.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        padding: '13px 14px',
        cursor: onClick ? 'pointer' : 'default'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '0 0 auto',
        width: 40,
        height: 40,
        borderRadius: 'var(--r-sm)',
        background: 'var(--surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--accent)'
      }
    }, logo), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--text-primary)'
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-muted)',
        marginTop: 3
      }
    }, date, where ? ` · ${where}` : '', recap ? '  ·  recap' : '')), met != null && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '0 0 auto',
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 17,
        color: 'var(--accent)'
      }
    }, met), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-muted)',
        textTransform: 'uppercase'
      }
    }, "met")));
  }
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      flex: '0 0 auto',
      width: 150,
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: 13,
      cursor: onClick ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: 6
    }
  }, host), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)',
      lineHeight: 1.15,
      marginBottom: 8
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, date, met != null ? ` · ${met} met` : ''));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/EventCard.jsx", error: String((e && e.message) || e) }); }

// components/data-display/EventRow.jsx
try { (() => {
/**
 * SODA EventRow — a full-width row for an event in a host's list: host
 * identity eyebrow, event name, and a status tag. A live event shows a
 * green "Live now" dot-tag; the rest read as muted labels. Used on the
 * host welcome-back screen.
 */
function EventRow({
  host,
  name,
  status = 'Upcoming',
  live = false,
  onClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      width: '100%',
      textAlign: 'left',
      background: 'var(--surface-1)',
      border: `1px solid ${live ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 'var(--r-md)',
      padding: '13px 14px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color var(--dur-fast) var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-nano)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 5
    }
  }, host), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-primary)'
    }
  }, name)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-micro)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--r-pill)',
      color: live ? 'var(--accent)' : 'var(--text-muted)',
      background: live ? 'var(--accent-soft)' : 'var(--surface-2)'
    }
  }, live && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--accent)'
    }
  }), live ? 'Live now' : status));
}
Object.assign(__ds_scope, { EventRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/EventRow.jsx", error: String((e && e.message) || e) }); }

// components/data-display/RolePill.jsx
try { (() => {
/**
 * SODA RolePill — a read-only badge for a host role that was *granted*,
 * not chosen. `owner` reads on the calm deep-green surface; `collaborator`
 * is a quiet muted tag; `granted` is the solid green pill used on the
 * account-setup screen to confirm the role assigned by invite.
 */
function RolePill({
  children,
  tone = 'collaborator',
  style = {}
}) {
  const tones = {
    granted: {
      color: 'var(--on-accent)',
      background: 'var(--accent)',
      border: '1px solid var(--accent)'
    },
    owner: {
      color: 'var(--accent-bright)',
      background: 'var(--surface-green)',
      border: '1px solid transparent'
    },
    collaborator: {
      color: 'var(--text-secondary)',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-strong)'
    }
  };
  const t = tones[tone] || tones.collaborator;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-micro)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      padding: '5px 11px',
      borderRadius: 'var(--r-pill)',
      whiteSpace: 'nowrap',
      ...t,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { RolePill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/RolePill.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatTile.jsx
try { (() => {
/**
 * SODA StatTile — a single live vital sign. Big Archivo Black number
 * (green by default) over a mono uppercase label. The unit of the Live
 * Stat Bar and the dashboard counts.
 */
function StatTile({
  value,
  label,
  color = 'var(--accent)',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '16px 18px',
      minWidth: 110,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      lineHeight: 1,
      color
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, label));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/feedback/BottomSheet.jsx
try { (() => {
/**
 * SODA BottomSheet — a dark sheet that rises over a dimmed near-black
 * screen at a calm moment. Rounded top, a small grabber handle, and an
 * optional title. Light and optional, never blocking: tapping the dim
 * backdrop closes it. Renders absolutely inside its nearest positioned
 * ancestor (e.g. the phone frame).
 */
function BottomSheet({
  open = true,
  onClose,
  title,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'flex-end',
      background: 'rgba(0,0,0,0.6)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity var(--dur-base) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": typeof title === 'string' ? title : 'Sheet',
    style: {
      width: '100%',
      background: 'var(--surface-1)',
      borderTop: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-2xl) var(--r-2xl) 0 0',
      padding: '14px 18px 24px',
      boxShadow: 'var(--shadow-pop)',
      transform: open ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform var(--dur-base) var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 'var(--r-pill)',
      background: 'var(--border-strong)',
      margin: '0 auto 16px'
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)',
      fontSize: 'var(--fs-display-s)',
      color: 'var(--text-primary)',
      marginBottom: 10
    }
  }, title), children));
}
Object.assign(__ds_scope, { BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
/**
 * SODA ProgressBar — a thin green fill on a dark track. Used by the
 * one-question-at-a-time survey and any stepped flow. Pass `value`
 * and `max`, or a 0–1 `ratio`.
 */
function ProgressBar({
  value,
  max = 100,
  ratio,
  color = 'var(--accent)',
  height = 6,
  style = {}
}) {
  const pct = ratio != null ? ratio * 100 : Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      width: '100%',
      background: 'var(--surface-2)',
      borderRadius: 'var(--r-pill)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${pct}%`,
      background: color,
      borderRadius: 'var(--r-pill)',
      transition: 'width var(--dur-base) var(--ease)'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/**
 * SODA Toast — a small confirmation pill that rises from the bottom.
 * Green dot + message. Tone changes the accent edge (green confirm,
 * purple private, red error). Render with `show` to animate in.
 */
function Toast({
  message,
  show = true,
  tone = 'green',
  style = {}
}) {
  const edge = {
    green: 'var(--accent)',
    purple: 'var(--private)',
    danger: 'var(--danger)'
  }[tone] || 'var(--accent)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--surface-2)',
      border: `1px solid ${edge}`,
      color: 'var(--text-primary)',
      fontSize: 13,
      padding: '11px 18px',
      borderRadius: 'var(--r-pill)',
      boxShadow: 'var(--shadow-toast)',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity var(--dur-base) var(--ease), transform var(--dur-base) var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: edge
    }
  }), message);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SODA Button — the one interactive primary is green; ghost and
 * private (purple) are the supporting variants. Full-width by
 * default, as on the mobile spine.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  icon = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '9px 13px',
      fontSize: 13
    },
    md: {
      padding: '14px 16px',
      fontSize: 15
    },
    lg: {
      padding: '16px 18px',
      fontSize: 16
    }
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      border: '1px solid var(--accent)'
    },
    ghost: {
      background: 'var(--surface-1)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)'
    },
    purple: {
      background: 'var(--private-soft)',
      color: 'var(--private)',
      border: '1px solid var(--private-border)'
    },
    danger: {
      background: 'var(--danger-soft)',
      color: 'var(--danger)',
      border: '1px solid var(--danger)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      width: block ? '100%' : 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-semibold)',
      borderRadius: 'var(--r-md)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      lineHeight: 1.1,
      transition: 'filter var(--dur-fast) var(--ease)',
      ...sizes[size],
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.filter = 'brightness(0.92)';
    },
    onMouseUp: e => {
      e.currentTarget.style.filter = 'none';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: '1.05em',
      lineHeight: 1
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SODA Chip — a tappable pill for the Role / Offer / Need steps and
 * profile editing. Selected state fills green. Optionally shows a
 * small leading "+" affordance for write-ins.
 */
function Chip({
  children,
  selected = false,
  onClick,
  writeIn = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 'var(--fw-regular)',
      minHeight: 44,
      padding: '10px 16px',
      borderRadius: 'var(--r-pill)',
      cursor: 'pointer',
      transition: 'transform var(--dur-fast) var(--ease)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      backgroundColor: selected ? 'var(--accent)' : 'var(--surface-1)',
      color: selected ? 'var(--on-accent)' : 'var(--text-secondary)',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: selected ? 'var(--accent)' : 'var(--border-strong)',
      ...style
    }
  }, rest), writeIn && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      opacity: 0.7
    }
  }, "\uFF0B"), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/CodeInput.jsx
try { (() => {
/**
 * SODA CodeInput — the six-digit email verification entry. Renders N
 * cells; the active cell shows a green border. Display-only by default
 * (pass `value` + `onChange` to drive it), built to match the Sign-In
 * code screen.
 */
function CodeInput({
  length = 6,
  value = '',
  onChange,
  error = false
}) {
  const cells = Array.from({
    length
  });
  const handle = e => {
    if (!onChange) return;
    const v = e.target.value.replace(/\D/g, '').slice(0, length);
    onChange(v);
  };
  const activeIndex = Math.min(value.length, length - 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: handle,
    inputMode: "numeric",
    autoComplete: "one-time-code",
    style: {
      position: 'absolute',
      opacity: 0,
      inset: 0,
      width: '100%',
      height: '100%',
      cursor: 'text'
    },
    "aria-label": `${length}-digit code`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'center'
    }
  }, cells.map((_, i) => {
    const filled = i < value.length;
    const isActive = i === activeIndex && value.length < length;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 46,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-1)',
        border: `1px solid ${error ? 'var(--danger)' : isActive ? 'var(--accent)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--r-md)',
        fontFamily: 'var(--font-mono)',
        fontSize: 24,
        fontWeight: 'var(--fw-medium)',
        color: 'var(--text-primary)'
      }
    }, filled ? value[i] : '');
  })));
}
Object.assign(__ds_scope, { CodeInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/CodeInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SODA Input — a labelled text field. Mono uppercase label sits above
 * a dark field; the border turns green on focus. Pass `error` to show
 * a red recoverable message beneath (the only place red appears).
 */
function Input({
  label,
  error,
  hint,
  style = {},
  id,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 15
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-micro)',
      letterSpacing: 'var(--ls-tag)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      width: '100%',
      background: 'var(--surface-1)',
      border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--r-sm)',
      padding: '12px 13px',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      outline: 'none',
      transition: 'border-color var(--dur-fast) var(--ease)',
      ...style
    }
  }, rest)), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--danger)',
      fontSize: 13,
      marginTop: 7
    }
  }, error), !error && hint && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 12,
      marginTop: 7
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/ResendControl.jsx
try { (() => {
/**
 * SODA ResendControl — the calm "Resend code" control on the code screen.
 * While the timer runs it reads "Resend in 0:20" in muted grey; at zero it
 * becomes an active green text link. Calm, never alarming. Pass `seconds`
 * for the initial countdown and `onResend` for the tap; it restarts the
 * timer on its own.
 */
function ResendControl({
  seconds = 20,
  onResend,
  label = 'Resend code',
  style = {}
}) {
  const [remaining, setRemaining] = React.useState(seconds);
  React.useEffect(() => {
    if (remaining <= 0) return undefined;
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const ready = remaining <= 0;
  const handle = () => {
    if (!ready) return;
    if (onResend) onResend();
    setRemaining(seconds);
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: handle,
    disabled: !ready,
    style: {
      background: 'none',
      border: 'none',
      padding: '6px 4px',
      cursor: ready ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: ready ? 'var(--fw-semibold)' : 'var(--fw-regular)',
      color: ready ? 'var(--accent)' : 'var(--text-muted)',
      transition: 'color var(--dur-fast) var(--ease)',
      ...style
    }
  }, ready ? label : `Resend in ${fmt(remaining)}`);
}
Object.assign(__ds_scope, { ResendControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ResendControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedToggle.jsx
try { (() => {
/**
 * SODA SegmentedToggle — a 2–3 option segmented control on a dark track.
 * The selected option fills SODA green with near-black text; the rest
 * stay quiet. Each option may carry a tiny subtitle (e.g. Full / Simple
 * in Event Mode). Controlled: pass `value` + `onChange`.
 */
function SegmentedToggle({
  options = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      background: 'var(--surface-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-md)',
      padding: 4,
      ...style
    }
  }, options.map(opt => {
    const o = typeof opt === 'string' ? {
      value: opt,
      label: opt
    } : opt;
    const selected = value === o.value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      role: "tab",
      "aria-selected": selected,
      onClick: () => onChange && onChange(o.value),
      style: {
        flex: 1,
        minHeight: o.subtitle ? 'auto' : 36,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: o.subtitle ? '10px 8px' : '9px 8px',
        borderRadius: 'var(--r-sm)',
        border: 'none',
        cursor: 'pointer',
        background: selected ? 'var(--accent)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 'var(--fw-semibold)',
        color: selected ? 'var(--on-accent)' : 'var(--text-secondary)'
      }
    }, o.label), o.subtitle && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        fontWeight: 'var(--fw-light)',
        lineHeight: 1.2,
        color: selected ? 'rgba(17,17,17,0.7)' : 'var(--text-muted)'
      }
    }, o.subtitle));
  }));
}
Object.assign(__ds_scope, { SegmentedToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedToggle.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Carousel.jsx
try { (() => {
/**
 * SODA Carousel — a short, skippable onboarding carousel. A thin green
 * progress cue ("2 of 4") and a quiet Skip link sit at the top, always
 * visible; one card shows in the center; a full-width green button
 * advances ("Next" → "Got it" on the last card). Light, concrete, never
 * a wall of text. Manages its own index. `cards` is an array of nodes.
 */
function Carousel({
  cards = [],
  onDone,
  onSkip,
  nextLabel = 'Next',
  doneLabel = 'Got it',
  renderButton
}) {
  const [i, setI] = React.useState(0);
  const last = i >= cards.length - 1;
  const next = () => last ? onDone && onDone() : setI(n => n + 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      letterSpacing: 'var(--ls-tag-wide)',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, i + 1, " of ", cards.length), /*#__PURE__*/React.createElement("button", {
    onClick: onSkip,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      padding: 4
    }
  }, "Skip")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 0
    }
  }, cards[i]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      justifyContent: 'center',
      marginBottom: 16
    }
  }, cards.map((_, n) => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      width: n === i ? 18 : 6,
      height: 6,
      borderRadius: 'var(--r-pill)',
      background: n === i ? 'var(--accent)' : 'var(--border-strong)',
      transition: 'width var(--dur-fast) var(--ease)'
    }
  }))), renderButton ? renderButton({
    last,
    next,
    label: last ? doneLabel : nextLabel
  }) : null);
}
Object.assign(__ds_scope, { Carousel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Carousel.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SectionHeader.jsx
try { (() => {
/**
 * SODA SectionHeader — a mono uppercase label with an optional green
 * "See all" action on the right. The quiet divider between blocks on
 * the Home and the cockpit panels.
 */
function SectionHeader({
  title,
  action,
  onAction,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '6px 0 11px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, title), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--accent)'
    }
  }, action));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
/**
 * SODA TabBar — the fixed bottom tab bar of the Home. Each tab is an
 * icon glyph over a mono label; the active tab is green. A purple dot
 * marks a tab with waiting nudges.
 */
function TabBar({
  tabs,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderTop: '1px solid var(--border)',
      background: '#0e0f0e'
    }
  }, tabs.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => onChange && onChange(t.id),
      style: {
        flex: 1,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '11px 0 13px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        color: on ? 'var(--accent)' : 'var(--text-muted)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        lineHeight: 1
      },
      "aria-hidden": "true"
    }, t.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
      }
    }, t.label), t.dot && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 7,
        right: '50%',
        marginRight: -22,
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--private)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// screens/access.jsx
try { (() => {
/* ============================================================
   New Screens · Access & Sessions
   1 · CodeHelp        — sign-in code, help state (code not arriving)
   2 · WelcomeBack     — returning person, expired session re-auth
   3 · AddToHome       — add-to-home-screen bottom sheet
   Each returns the inner screen content; a frame wraps it.
   ============================================================ */
const {
  Button,
  CodeInput,
  ResendControl,
  BottomSheet,
  CenterScreen,
  Display,
  Eyebrow,
  HostMark,
  SodaMark
} = window;
function LinkBtn({
  children,
  onClick,
  color = 'var(--accent)',
  size = 14,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: size,
      fontWeight: 600,
      color,
      ...(style || {})
    }
  }, children);
}

/* 1 · The code-not-arriving help state */
function CodeHelp() {
  const [code, setCode] = React.useState('');
  return /*#__PURE__*/React.createElement(CenterScreen, {
    pad: "18px 16px 22px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "maya@futureland.com"), /*#__PURE__*/React.createElement(LinkBtn, {
    size: 13
  }, "Edit")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(CodeInput, {
    length: 6,
    value: code,
    onChange: setCode
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-primary)',
      textAlign: 'center',
      margin: '20px 0 6px',
      maxWidth: 260,
      lineHeight: 1.5
    }
  }, "It can take a moment. Check your spam folder too."), /*#__PURE__*/React.createElement(ResendControl, {
    seconds: 20
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 300,
      maxWidth: 280,
      margin: '0 auto'
    }
  }, "At the event? Ask the host to check you in."));
}

/* 2 · The welcome-back re-authentication */
function WelcomeBack({
  live = true,
  onContinue
}) {
  const [code, setCode] = React.useState('');
  return /*#__PURE__*/React.createElement(CenterScreen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 6
    }
  }, live ? /*#__PURE__*/React.createElement(HostMark, {
    host: "Futureland",
    sub: "Creative Meetup",
    size: 20
  }) : /*#__PURE__*/React.createElement(SodaMark, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: 30,
    style: {
      maxWidth: 300
    }
  }, "Welcome back,", /*#__PURE__*/React.createElement("br", null), "Maya"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-primary)',
      marginTop: 14,
      maxWidth: 270
    }
  }, "Confirm it is you to pick up where you left off."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement(CodeInput, {
    length: 6,
    value: code,
    onChange: setCode
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.5px',
      color: 'var(--text-muted)',
      marginTop: 16
    }
  }, "Code sent to maya@futureland.com")), /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "lg",
    onClick: onContinue
  }, "CONTINUE"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(LinkBtn, {
    color: "var(--text-muted)"
  }, "Use a different email")));
}

/* 3 · The add-to-home-screen prompt (bottom sheet over a dimmed screen) */
function AddToHome({
  open = true,
  onClose
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '18px 16px',
      opacity: 0.5,
      filter: 'blur(0.5px)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Your contacts"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), ['Jordan Blake', 'Priya Nair', 'Marcus Webb', 'Tasha Boyd', 'Devon Carter'].map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 4px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--surface-2)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 11,
      width: '46%',
      background: 'var(--surface-2)',
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 9,
      width: '30%',
      background: 'var(--surface-1)',
      borderRadius: 4,
      marginTop: 7
    }
  }))))), /*#__PURE__*/React.createElement(BottomSheet, {
    open: open,
    onClose: onClose,
    title: "Keep SODA handy"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-primary)',
      lineHeight: 1.5,
      marginTop: 0,
      marginBottom: 18,
      maxWidth: 300
    }
  }, "Add it to your home screen so your contacts are one tap away."), /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "lg",
    onClick: onClose
  }, "ADD TO HOME SCREEN"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(LinkBtn, {
    color: "var(--text-muted)",
    onClick: onClose
  }, "Maybe later"))));
}
Object.assign(window, {
  LinkBtn,
  CodeHelp,
  WelcomeBack,
  AddToHome
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/access.jsx", error: String((e && e.message) || e) }); }

// screens/collab.jsx
try { (() => {
/* ============================================================
   New Screens · Collaborator Onboarding
   8  · CollaboratorWelcome  — welcomed to a specific event
   9  · CollaboratorTutorial — short skippable carousel
   10 · HostWelcomeBack      — returning Owner/Collaborator, routed
   ============================================================ */
const {
  Button: CButton,
  RolePill: CRole,
  EventRow,
  Carousel,
  CenterScreen: CCenter,
  Display: CDisplay,
  HostMark: CHostMark,
  SodaMark: CSoda,
  IllosTile
} = window;

/* 8 · The Collaborator Welcome */
function CollaboratorWelcome({
  onShow,
  onSkip
}) {
  return /*#__PURE__*/React.createElement(CCenter, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(CHostMark, {
    host: "Futureland",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(CDisplay, {
    size: 32
  }, "Welcome,", /*#__PURE__*/React.createElement("br", null), "Nicole"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-primary)',
      marginTop: 16,
      maxWidth: 280
    }
  }, "Future added you to help run ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600
    }
  }, "Creative Meetup"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(CRole, {
    tone: "granted"
  }, "Collaborator")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 14,
      maxWidth: 260,
      lineHeight: 1.5
    }
  }, "You can run the night. The owner keeps the guest data.")), /*#__PURE__*/React.createElement(CButton, {
    block: true,
    size: "lg",
    onClick: onShow
  }, "SHOW ME AROUND"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onSkip,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-muted)',
      padding: 0
    }
  }, "Skip")));
}

/* 9 · The Collaborator Tutorial (carousel) */
const TUT_CARDS = [{
  kind: 'fire',
  title: 'How a moment fires',
  body: 'The owner fires a moment like the Drop. You will see it land here.'
}, {
  kind: 'see',
  title: 'What you see live',
  body: 'Scans, responses, and pairs update in real time on the Command Center.'
}, {
  kind: 'data',
  title: 'The owner keeps the data',
  body: 'You run the night; the guest contacts stay with the event owner.'
}];
function TutorialCardBody({
  card
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(IllosTile, {
    kind: card.kind
  }), /*#__PURE__*/React.createElement(CDisplay, {
    size: 22,
    style: {
      marginBottom: 10
    }
  }, card.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-primary)',
      lineHeight: 1.5,
      maxWidth: 280,
      margin: '0 auto'
    }
  }, card.body));
}
function CollaboratorTutorial({
  onDone,
  onSkip
}) {
  return /*#__PURE__*/React.createElement(CCenter, null, /*#__PURE__*/React.createElement(Carousel, {
    cards: TUT_CARDS.map((c, i) => /*#__PURE__*/React.createElement(TutorialCardBody, {
      key: i,
      card: c
    })),
    onDone: onDone,
    onSkip: onSkip,
    renderButton: ({
      next,
      label
    }) => /*#__PURE__*/React.createElement(CButton, {
      block: true,
      size: "lg",
      onClick: next
    }, label.toUpperCase())
  }));
}

/* 10 · The Host Welcome-Back */
const HOST_EVENTS = [{
  host: 'Futureland',
  name: 'Creative Meetup',
  live: true
}, {
  host: 'Black Tech Week',
  name: 'BTW Activation',
  status: 'Sat, Jun 14'
}, {
  host: 'Equalpoint',
  name: 'Founder Mixer',
  status: 'Draft'
}];
function HostWelcomeBack({
  onEnter
}) {
  const hasLive = HOST_EVENTS.some(e => e.live);
  return /*#__PURE__*/React.createElement(CCenter, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(CSoda, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(CDisplay, {
    size: 30,
    style: {
      textAlign: 'center',
      marginBottom: 22
    }
  }, "Welcome back,", /*#__PURE__*/React.createElement("br", null), "Nicole"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, HOST_EVENTS.map(e => /*#__PURE__*/React.createElement(EventRow, {
    key: e.name,
    host: e.host,
    name: e.name,
    live: e.live,
    status: e.status
  })))), /*#__PURE__*/React.createElement(CButton, {
    block: true,
    size: "lg",
    onClick: onEnter
  }, hasLive ? 'ENTER THE COMMAND CENTER' : 'OPEN YOUR EVENT'), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      padding: 0
    }
  }, "See all events")));
}
Object.assign(window, {
  CollaboratorWelcome,
  CollaboratorTutorial,
  HostWelcomeBack
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/collab.jsx", error: String((e && e.message) || e) }); }

// screens/design-canvas.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Exports (to window): DesignCanvas, DCSection, DCArtboard, DCPostIt.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>
//
// Artboards are static design frames, not scroll regions — never use
// height: 100% + overflow: auto/scroll on inner elements; size each artboard
// to fit its content (explicit pixel height, or let it grow).
/* END USAGE */

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/design-canvas.jsx", error: String((e && e.message) || e) }); }

// screens/frames.jsx
try { (() => {
/* ============================================================
   SODA — New Screens · shared frames & primitives
   Local scaffolding for the 10 new screens. Device frames (phone,
   tablet, admin shell) and display-type primitives mirror the SODA
   attendee/admin kits so the screens render standalone. Product
   patterns (Button, CodeInput, SegmentedToggle, RolePill, EventRow,
   BottomSheet, Carousel, …) come from the compiled DS bundle.
   Exports to window for sibling babel files.
   ============================================================ */

/* ---- Display-type primitives ---- */
function Display({
  children,
  size = 26,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)',
      lineHeight: 1.02,
      color: 'var(--text-primary)',
      fontSize: size,
      ...(style || {})
    }
  }, children);
}
function Eyebrow({
  children,
  color = 'var(--accent)',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '3px',
      textTransform: 'uppercase',
      color,
      ...(style || {})
    }
  }, children);
}
function MonoLabel({
  children,
  color = 'var(--text-muted)',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color,
      ...(style || {})
    }
  }, children);
}

/* ---- The quiet SODA mark ---- */
function SodaMark({
  size = 18
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)',
      fontSize: size,
      color: 'var(--text-secondary)'
    }
  }, "SODA ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "\u2726"));
}

/* ---- Host identity block (typed name / wordmark) ---- */
function HostMark({
  host,
  sub,
  size = 22
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)',
      fontSize: size,
      color: 'var(--text-primary)'
    }
  }, host), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, sub));
}

/* ---- Footer wordmark line ---- */
function Footer() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1.5px',
      color: 'var(--text-faint)',
      textTransform: 'uppercase'
    }
  }, "SODA \u2726 powered by Equalpoint");
}

/* ---- Phone frame: 380×780 device, flex column ---- */
function PhoneFrame({
  children,
  statusHost
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      maxWidth: '100%',
      background: '#000',
      border: '9px solid #1c1d1c',
      borderRadius: 'var(--r-device)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-device)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-canvas)',
      height: 780,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      height: 34,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: '1px'
    }
  }, statusHost || ''), /*#__PURE__*/React.createElement("span", null, "\u25CF \u25CF \u25CF")), children));
}

/* ---- Tablet frame: portrait device for sturdier host screens ---- */
function TabletFrame({
  children,
  statusHost,
  height = 840
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 620,
      maxWidth: '100%',
      background: '#000',
      border: '12px solid #1c1d1c',
      borderRadius: 28,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-device)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-canvas)',
      height,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 26px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: '1px'
    }
  }, statusHost || ''), /*#__PURE__*/React.createElement("span", null, "\u25CF \u25CF \u25CF")), children));
}

/* ---- Admin shell: desktop back-office surface (no bezel) ---- */
function AdminShell({
  children,
  event = 'Futureland · Creative Meetup',
  width = 880,
  height = 620
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      background: 'var(--bg-deep)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-pop)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 22px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 18,
      color: 'var(--text-primary)',
      letterSpacing: 'var(--ls-display)'
    }
  }, "SODA ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "\u2726")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Admin \xB7 ", event)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '26px 28px'
    }
  }, children));
}

/* ---- Centered mobile screen body ---- */
function CenterScreen({
  children,
  bg = 'var(--bg-canvas)',
  pad = '24px 22px 28px',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: pad,
      background: bg,
      minHeight: 0,
      ...(style || {})
    }
  }, children);
}

/* ---- Scrolling screen body ---- */
function ScreenBody({
  children,
  pad = '20px',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "soda-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: pad,
      minHeight: 0,
      ...(style || {})
    }
  }, children);
}

/* ---- Simple line illustration tile (for tutorial cards) ---- */
function IllosTile({
  kind = 'fire'
}) {
  const stroke = 'var(--accent)';
  const dim = 'var(--text-faint)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: 150,
      borderRadius: 'var(--r-lg)',
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "160",
    height: "96",
    viewBox: "0 0 160 96",
    fill: "none"
  }, kind === 'fire' && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "30",
    cy: "48",
    r: "13",
    stroke: stroke,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M30 48 L70 30 M30 48 L70 48 M30 48 L70 66",
    stroke: dim,
    strokeWidth: "1.5"
  }), [30, 48, 66].map((y, n) => /*#__PURE__*/React.createElement("rect", {
    key: n,
    x: "72",
    y: y - 11,
    width: "16",
    height: "22",
    rx: "3",
    stroke: stroke,
    strokeWidth: "2"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M118 30 L118 66",
    stroke: dim,
    strokeWidth: "1.5",
    strokeDasharray: "3 3"
  })), kind === 'see' && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "22",
    width: "80",
    height: "52",
    rx: "6",
    stroke: stroke,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "48",
    r: "9",
    stroke: dim,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M62 62 H98",
    stroke: dim,
    strokeWidth: "1.5"
  })), kind === 'data' && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "44",
    y: "20",
    width: "72",
    height: "56",
    rx: "6",
    stroke: stroke,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M44 38 H116 M70 20 V76",
    stroke: dim,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "92",
    cy: "56",
    r: "3",
    fill: stroke
  }))));
}
Object.assign(window, {
  Display,
  Eyebrow,
  MonoLabel,
  SodaMark,
  HostMark,
  Footer,
  PhoneFrame,
  TabletFrame,
  AdminShell,
  CenterScreen,
  ScreenBody,
  IllosTile
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/frames.jsx", error: String((e && e.message) || e) }); }

// screens/host.jsx
try { (() => {
/* ============================================================
   New Screens · Host Access
   4 · EventModeControl       — Full / Simple toggle (host setup section)
   5 · HostSignIn             — known host logs in
   6 · HostAccountSetup       — new host / invite acceptance
   7 · CollaboratorManagement — Owner manages who can run the event
   ============================================================ */
const {
  Button: HButton,
  Input: HInput,
  CodeInput: HCode,
  SegmentedToggle,
  RolePill,
  Avatar: HAvatar,
  Display: HDisplay,
  MonoLabel: HMono,
  SodaMark: HSoda
} = window;

/* centered column helper for tablet screens */
function TabletColumn({
  children,
  max = 420
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '32px 40px',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: max,
      margin: '0 auto'
    }
  }, children));
}

/* 4 · Event Mode control */
const MODE_COPY = {
  full: 'Guests get the full night — they scan in, build a profile, and the live acts (the Drop, the Chance, the Nudge) fire in the room.',
  simple: 'Guests scan in, build a quick profile, and scan again for the survey. The live acts stay off.'
};
function EventModeControl() {
  const [mode, setMode] = React.useState('simple');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement(HMono, {
    style: {
      marginBottom: 12
    }
  }, "Event Mode"), /*#__PURE__*/React.createElement(SegmentedToggle, {
    value: mode,
    onChange: setMode,
    options: [{
      value: 'full',
      label: 'Full',
      subtitle: 'The whole experience'
    }, {
      value: 'simple',
      label: 'Simple',
      subtitle: 'Entry and survey only'
    }]
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-primary)',
      lineHeight: 1.55,
      margin: '18px 0 16px',
      maxWidth: 480
    }
  }, MODE_COPY[mode]), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, "Adjust individual acts"));
}

/* 5 · Host Sign-In */
function HostSignIn({
  onContinue
}) {
  const [code, setCode] = React.useState('');
  return /*#__PURE__*/React.createElement(TabletColumn, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement(HSoda, null), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 18
    }
  }), /*#__PURE__*/React.createElement(HDisplay, {
    size: 28
  }, "Host sign-in"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-primary)',
      marginTop: 12
    }
  }, "Sign in to run your events.")), /*#__PURE__*/React.createElement(HInput, {
    label: "Email",
    type: "email",
    defaultValue: "nicole@futureland.com"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, "Code"), /*#__PURE__*/React.createElement(CodeRowCentered, null, /*#__PURE__*/React.createElement(HCode, {
    length: 6,
    value: code,
    onChange: setCode
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement(HButton, {
    block: true,
    size: "lg",
    onClick: onContinue
  }, "CONTINUE"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 300,
      color: 'var(--text-muted)',
      marginTop: 18,
      lineHeight: 1.5
    }
  }, "Hosts are added by invite. Need access? Contact your event owner."));
}
function CodeRowCentered({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-start'
    }
  }, children);
}

/* 6 · Host Account & Invite Setup */
function HostAccountSetup({
  onCreate
}) {
  return /*#__PURE__*/React.createElement(TabletColumn, null, /*#__PURE__*/React.createElement(HDisplay, {
    size: 26
  }, "Set up your", /*#__PURE__*/React.createElement("br", null), "host account"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.5px',
      color: 'var(--text-muted)',
      margin: '12px 0 26px'
    }
  }, "Added by Futureland as an Owner."), /*#__PURE__*/React.createElement(HInput, {
    label: "Name",
    defaultValue: "Nicole Adams"
  }), /*#__PURE__*/React.createElement(HInput, {
    label: "Email",
    type: "email",
    defaultValue: "nicole@futureland.com"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, "Role"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(RolePill, {
    tone: "granted"
  }, "Owner"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      fontWeight: 300
    }
  }, "Granted by invite"))), /*#__PURE__*/React.createElement(HButton, {
    block: true,
    size: "lg",
    onClick: onCreate
  }, "CREATE ACCOUNT"));
}

/* 7 · Collaborator Management */
const TEAM = [{
  name: 'Nicole Adams',
  role: 'owner',
  you: true
}, {
  name: 'Marcus Webb',
  role: 'collaborator'
}, {
  name: 'Simone Ford',
  role: 'collaborator'
}];
function CollaboratorManagement() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement(HMono, {
    style: {
      marginBottom: 14
    }
  }, "Who can run this event"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginBottom: 18
    }
  }, TEAM.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement(HAvatar, {
    name: p.name,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, p.name, p.you && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 300,
      color: 'var(--text-muted)',
      marginLeft: 8
    }
  }, "(you)"))), /*#__PURE__*/React.createElement(RolePill, {
    tone: p.role === 'owner' ? 'owner' : 'collaborator'
  }, p.role === 'owner' ? 'Owner' : 'Collaborator')))), /*#__PURE__*/React.createElement("button", {
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      background: 'var(--surface-1)',
      border: '1px solid var(--accent)',
      color: 'var(--accent)',
      borderRadius: 'var(--r-md)',
      padding: '14px 16px',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.1em',
      lineHeight: 1
    }
  }, "\uFF0B"), " Add a collaborator"));
}
Object.assign(window, {
  TabletColumn,
  EventModeControl,
  HostSignIn,
  HostAccountSetup,
  CollaboratorManagement
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/host.jsx", error: String((e && e.message) || e) }); }

// screens/kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   SODA — New Screens · local component kit
   Self-contained mirrors of the SODA product components (same tokens
   as components/*), so the new-screen prototypes render standalone
   without depending on _ds_bundle.js build timing — exactly as the
   attendee kit mirrors its primitives. The canonical, typed versions
   live in components/ for consuming projects. Exports to window.
   ============================================================ */

/* ---- Avatar ---- */
const KIT_PAL = ['var(--av-1)', 'var(--av-2)', 'var(--av-3)', 'var(--av-4)', 'var(--av-5)', 'var(--av-6)', 'var(--av-7)', 'var(--av-8)'];
function kitInitials(n) {
  return (n || '').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
}
function kitColor(n) {
  let h = 0;
  for (let i = 0; i < (n || '').length; i++) h = h * 31 + n.charCodeAt(i) >>> 0;
  return KIT_PAL[h % KIT_PAL.length];
}
function Avatar({
  name = '',
  src = null,
  size = 48,
  color,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.38),
      color: '#fff',
      background: src ? `center/cover no-repeat url(${src})` : color || kitColor(name),
      overflow: 'hidden',
      userSelect: 'none',
      ...style
    }
  }, !src && kitInitials(name));
}

/* ---- Button ---- */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  icon = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '9px 13px',
      fontSize: 13
    },
    md: {
      padding: '14px 16px',
      fontSize: 15
    },
    lg: {
      padding: '16px 18px',
      fontSize: 16
    }
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      border: '1px solid var(--accent)'
    },
    ghost: {
      background: 'var(--surface-1)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)'
    },
    purple: {
      background: 'var(--private-soft)',
      color: 'var(--private)',
      border: '1px solid var(--private-border)'
    },
    danger: {
      background: 'var(--danger-soft)',
      color: 'var(--danger)',
      border: '1px solid var(--danger)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      width: block ? '100%' : 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      borderRadius: 'var(--r-md)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      lineHeight: 1.1,
      transition: 'filter var(--dur-fast) var(--ease)',
      ...sizes[size],
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.filter = 'brightness(0.92)';
    },
    onMouseUp: e => {
      e.currentTarget.style.filter = 'none';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: '1.05em',
      lineHeight: 1
    }
  }, icon), children);
}

/* ---- Input ---- */
function Input({
  label,
  error,
  hint,
  style = {},
  id,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const fieldId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 15
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-micro)',
      letterSpacing: 'var(--ls-tag)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      width: '100%',
      background: 'var(--surface-1)',
      border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--r-sm)',
      padding: '12px 13px',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      outline: 'none',
      transition: 'border-color var(--dur-fast) var(--ease)',
      ...style
    }
  }, rest)), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--danger)',
      fontSize: 13,
      marginTop: 7
    }
  }, error), !error && hint && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 12,
      marginTop: 7
    }
  }, hint));
}

/* ---- CodeInput ---- */
function CodeInput({
  length = 6,
  value = '',
  onChange,
  error = false
}) {
  const cells = Array.from({
    length
  });
  const handle = e => {
    if (!onChange) return;
    onChange(e.target.value.replace(/\D/g, '').slice(0, length));
  };
  const activeIndex = Math.min(value.length, length - 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: handle,
    inputMode: "numeric",
    autoComplete: "one-time-code",
    style: {
      position: 'absolute',
      opacity: 0,
      inset: 0,
      width: '100%',
      height: '100%',
      cursor: 'text'
    },
    "aria-label": `${length}-digit code`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'center'
    }
  }, cells.map((_, i) => {
    const filled = i < value.length;
    const isActive = i === activeIndex && value.length < length;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 46,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-1)',
        border: `1px solid ${error ? 'var(--danger)' : isActive ? 'var(--accent)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--r-md)',
        fontFamily: 'var(--font-mono)',
        fontSize: 24,
        fontWeight: 'var(--fw-medium)',
        color: 'var(--text-primary)'
      }
    }, filled ? value[i] : '');
  })));
}

/* ---- SegmentedToggle ---- */
function SegmentedToggle({
  options = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      background: 'var(--surface-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-md)',
      padding: 4,
      ...style
    }
  }, options.map(opt => {
    const o = typeof opt === 'string' ? {
      value: opt,
      label: opt
    } : opt;
    const selected = value === o.value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      role: "tab",
      "aria-selected": selected,
      onClick: () => onChange && onChange(o.value),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: o.subtitle ? '10px 8px' : '9px 8px',
        borderRadius: 'var(--r-sm)',
        border: 'none',
        cursor: 'pointer',
        background: selected ? 'var(--accent)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 600,
        color: selected ? 'var(--on-accent)' : 'var(--text-secondary)'
      }
    }, o.label), o.subtitle && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        fontWeight: 300,
        lineHeight: 1.2,
        color: selected ? 'rgba(17,17,17,0.7)' : 'var(--text-muted)'
      }
    }, o.subtitle));
  }));
}

/* ---- ResendControl ---- */
function ResendControl({
  seconds = 20,
  onResend,
  label = 'Resend code',
  style = {}
}) {
  const [remaining, setRemaining] = React.useState(seconds);
  React.useEffect(() => {
    if (remaining <= 0) return undefined;
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const ready = remaining <= 0;
  const handle = () => {
    if (!ready) return;
    if (onResend) onResend();
    setRemaining(seconds);
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: handle,
    disabled: !ready,
    style: {
      background: 'none',
      border: 'none',
      padding: '6px 4px',
      cursor: ready ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: ready ? 600 : 400,
      color: ready ? 'var(--accent)' : 'var(--text-muted)',
      transition: 'color var(--dur-fast) var(--ease)',
      ...style
    }
  }, ready ? label : `Resend in ${fmt(remaining)}`);
}

/* ---- RolePill ---- */
function RolePill({
  children,
  tone = 'collaborator',
  style = {}
}) {
  const tones = {
    granted: {
      color: 'var(--on-accent)',
      background: 'var(--accent)',
      border: '1px solid var(--accent)'
    },
    owner: {
      color: 'var(--accent-bright)',
      background: 'var(--surface-green)',
      border: '1px solid transparent'
    },
    collaborator: {
      color: 'var(--text-secondary)',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-strong)'
    }
  };
  const t = tones[tone] || tones.collaborator;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-micro)',
      fontWeight: 500,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      padding: '5px 11px',
      borderRadius: 'var(--r-pill)',
      whiteSpace: 'nowrap',
      ...t,
      ...style
    }
  }, children);
}

/* ---- EventRow ---- */
function EventRow({
  host,
  name,
  status = 'Upcoming',
  live = false,
  onClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      width: '100%',
      textAlign: 'left',
      background: 'var(--surface-1)',
      border: `1px solid ${live ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 'var(--r-md)',
      padding: '13px 14px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color var(--dur-fast) var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-nano)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 5
    }
  }, host), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, name)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-micro)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--r-pill)',
      color: live ? 'var(--accent)' : 'var(--text-muted)',
      background: live ? 'var(--accent-soft)' : 'var(--surface-2)'
    }
  }, live && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--accent)'
    }
  }), live ? 'Live now' : status));
}

/* ---- BottomSheet ---- */
function BottomSheet({
  open = true,
  onClose,
  title,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'flex-end',
      background: 'rgba(0,0,0,0.6)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity var(--dur-base) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      background: 'var(--surface-1)',
      borderTop: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-2xl) var(--r-2xl) 0 0',
      padding: '14px 18px 24px',
      boxShadow: 'var(--shadow-pop)',
      transform: open ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform var(--dur-base) var(--ease)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 'var(--r-pill)',
      background: 'var(--border-strong)',
      margin: '0 auto 16px'
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-display)',
      fontSize: 'var(--fs-display-s)',
      color: 'var(--text-primary)',
      marginBottom: 10
    }
  }, title), children));
}

/* ---- Carousel ---- */
function Carousel({
  cards = [],
  onDone,
  onSkip,
  nextLabel = 'Next',
  doneLabel = 'Got it',
  renderButton
}) {
  const [i, setI] = React.useState(0);
  const last = i >= cards.length - 1;
  const next = () => last ? onDone && onDone() : setI(n => n + 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-label)',
      letterSpacing: 'var(--ls-tag-wide)',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, i + 1, " of ", cards.length), /*#__PURE__*/React.createElement("button", {
    onClick: onSkip,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      padding: 4
    }
  }, "Skip")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 0
    }
  }, cards[i]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      justifyContent: 'center',
      marginBottom: 16
    }
  }, cards.map((_, n) => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      width: n === i ? 18 : 6,
      height: 6,
      borderRadius: 'var(--r-pill)',
      background: n === i ? 'var(--accent)' : 'var(--border-strong)',
      transition: 'width var(--dur-fast) var(--ease)'
    }
  }))), renderButton ? renderButton({
    last,
    next,
    label: last ? doneLabel : nextLabel
  }) : null);
}
Object.assign(window, {
  Avatar,
  Button,
  Input,
  CodeInput,
  SegmentedToggle,
  ResendControl,
  RolePill,
  EventRow,
  BottomSheet,
  Carousel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "screens/kit.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/admin.jsx
try { (() => {
/* ============================================================
   SODA Admin Panel — host back office. Shell, shared bits, seed.
   Self-contained; same styles.css tokens.
   ============================================================ */
const A_PAL = ['var(--av-1)', 'var(--av-2)', 'var(--av-3)', 'var(--av-4)', 'var(--av-5)', 'var(--av-6)', 'var(--av-7)', 'var(--av-8)'];
function aInit(n) {
  return (n || '').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
}
function aColor(n) {
  let h = 0;
  for (let i = 0; i < (n || '').length; i++) h = h * 31 + n.charCodeAt(i) >>> 0;
  return A_PAL[h % A_PAL.length];
}
function AAvatar({
  name,
  size = 36,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.38),
      color: '#fff',
      background: aColor(name),
      ...(style || {})
    }
  }, aInit(name));
}
function AMono({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      ...(style || {})
    }
  }, children);
}
function APanel({
  title,
  right,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: '20px 22px',
      ...(style || {})
    }
  }, (title || right) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(AMono, {
    style: {
      fontSize: 11,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, title), right), children);
}
function AButton({
  children,
  variant = 'primary',
  onClick,
  disabled,
  icon,
  size = 'md',
  style
}) {
  const v = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      border: '1px solid var(--accent)'
    },
    ghost: {
      background: 'var(--surface-2)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)'
    },
    danger: {
      background: 'var(--danger-soft)',
      color: 'var(--danger)',
      border: '1px solid var(--danger)'
    },
    purple: {
      background: 'var(--private-soft)',
      color: 'var(--private)',
      border: '1px solid var(--private-border)'
    }
  }[variant];
  const sz = {
    sm: {
      padding: '7px 12px',
      fontSize: 13
    },
    md: {
      padding: '11px 16px',
      fontSize: 14,
      minWidth: 170
    }
  }[size];
  // minWidth 170 on md: reconciled from the root-file edit that forced
  // width 170 on every button. Min, not fixed, so long labels still fit.
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      borderRadius: 'var(--r-md)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...sz,
      ...v,
      ...(style || {})
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, icon), children);
}
function AField({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 15
    }
  }, /*#__PURE__*/React.createElement(AMono, {
    style: {
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      display: 'block',
      marginBottom: 6
    }
  }, label), children);
}
const aInput = {
  width: '100%',
  background: 'var(--surface-2)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--r-sm)',
  padding: '11px 13px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  outline: 'none'
};
const A_ROOM = [{
  name: 'Jordan Blake',
  role: 'Investor'
}, {
  name: 'Priya Nair',
  role: 'Designer'
}, {
  name: 'Marcus Webb',
  role: 'Engineer'
}, {
  name: 'Tasha Boyd',
  role: 'Founder'
}, {
  name: 'Devon Carter',
  role: 'Operator'
}, {
  name: 'Ana Reyes',
  role: 'Product'
}];
const A_CHIPS = [{
  text: 'Ghostwriting',
  by: 'Iris Chen'
}, {
  text: 'Fractional CFO',
  by: 'Drew Ellis'
}, {
  text: 'Community building',
  by: 'Simone Ford'
}, {
  text: 'Hardware',
  by: 'Leo Kim'
}];
const A_MATCHES = [{
  a: 'Tasha Boyd',
  b: 'Drew Ellis',
  mutual: true,
  why: 'pre-seed × capital'
}, {
  a: 'Marcus Webb',
  b: 'Noah Pratt',
  mutual: false,
  why: 'engineer × hiring'
}, {
  a: 'Ana Reyes',
  b: 'Leo Kim',
  mutual: true,
  why: 'infra × mentorship'
}];

/* ============================================================
   Lifecycle: Draft → Live → Closed, with a Cancelled escape hatch.
   PHASE_META drives pill + banner color/copy. The seam exposes the
   Go-live, End, and Cancel actions; ending or cancelling a LIVE event
   routes through a confirmation dialog.
   ============================================================ */
const PHASE_META = {
  draft: {
    label: 'Draft',
    color: 'var(--pending)',
    soft: 'rgba(255,210,63,.1)'
  },
  live: {
    label: 'Live',
    color: 'var(--accent)',
    soft: 'var(--accent-soft)'
  },
  closed: {
    label: 'Closed',
    color: 'var(--text-secondary)',
    soft: 'var(--surface-2)'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'var(--danger)',
    soft: 'var(--danger-soft)'
  }
};

/* Pill row — shows Draft · Live · (Closed|Cancelled). The third slot
   becomes a red "Cancelled" pill when the event was called off. */
function PhasePills({
  phase
}) {
  const third = phase === 'cancelled' ? 'cancelled' : 'closed';
  const seq = ['draft', 'live', third];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, seq.map(k => {
    const on = phase === k,
      m = PHASE_META[k];
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '7px 13px',
        borderRadius: 'var(--r-pill)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        border: `1px solid ${on ? m.color : 'var(--border)'}`,
        color: on ? m.color : 'var(--text-faint)',
        background: on ? m.soft : 'transparent'
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'currentColor'
      }
    }), m.label);
  }));
}

/* Confirmation dialog for ending or cancelling a live event. */
function EndEventDialog({
  open,
  onEnd,
  onCancel,
  onClose
}) {
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  React.useEffect(() => {
    if (!open) setConfirmCancel(false);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.66)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 440,
      background: 'var(--surface-1)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-2xl)',
      padding: '22px 22px 20px',
      boxShadow: 'var(--shadow-pop)'
    }
  }, /*#__PURE__*/React.createElement(AMono, {
    style: {
      fontSize: 11,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Wrap the night"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '-.01em',
      fontSize: 22,
      color: 'var(--text-primary)',
      marginTop: 8
    }
  }, "How do you want to end?"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-green)',
      borderRadius: 'var(--r-lg)',
      padding: '15px 16px',
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--accent-bright)',
      marginBottom: 7
    }
  }, "End the night \xB7 standard"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-primary)',
      fontWeight: 300,
      lineHeight: 1.45,
      marginBottom: 13
    }
  }, "Push the final survey, send everyone their recap, and turn the room read-only. The connections stay in the record."), /*#__PURE__*/React.createElement(AButton, {
    onClick: onEnd
  }, "End the night")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--danger-soft)',
      border: '1px solid var(--danger)',
      borderRadius: 'var(--r-lg)',
      padding: '15px 16px',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--danger)',
      marginBottom: 7
    }
  }, "Cancel the event \xB7 can't be undone"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-primary)',
      fontWeight: 300,
      lineHeight: 1.45,
      marginBottom: 13
    }
  }, "Call it off. Attendees are told it's cancelled, no recap goes out, and the night is not counted. Use only if the event didn't happen."), !confirmCancel ? /*#__PURE__*/React.createElement(AButton, {
    variant: "danger",
    onClick: () => setConfirmCancel(true)
  }, "Cancel event") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--danger)',
      fontWeight: 600
    }
  }, "Cancel for real?"), /*#__PURE__*/React.createElement(AButton, {
    variant: "danger",
    onClick: onCancel
  }, "Yes, cancel it"), /*#__PURE__*/React.createElement(AButton, {
    variant: "ghost",
    size: "sm",
    onClick: () => setConfirmCancel(false)
  }, "No"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Keep it running"))));
}

/* The lifecycle seam shown at the foot of every Admin view. Owns the
   dialog and the closed / cancelled state banners. layout: 'desktop'|'mobile'. */
function LifecycleSeam({
  phase,
  setPhase,
  flash,
  layout = 'desktop'
}) {
  const [dialog, setDialog] = React.useState(false);
  const m = PHASE_META[phase];
  const horiz = layout === 'desktop';
  const COPY = {
    draft: 'Identity is open. Go live to activate the QR and unlock the acts.',
    live: 'The night is running. End it to send recaps, or cancel if it never happened.',
    closed: 'The night is a record. Recaps were sent. Review matches and export the data.',
    cancelled: 'This event was cancelled. Attendees were notified and no recap was sent.'
  };
  const action = (() => {
    if (phase === 'draft') return /*#__PURE__*/React.createElement(AButton, {
      icon: "\u25C9",
      onClick: () => {
        setPhase('live');
        flash('Event is live · QR active');
      }
    }, "Go live");
    if (phase === 'live') return /*#__PURE__*/React.createElement(AButton, {
      variant: "danger",
      icon: "\u23FB",
      onClick: () => setDialog(true)
    }, "End or cancel\u2026");
    return /*#__PURE__*/React.createElement(AButton, {
      variant: "ghost",
      onClick: () => {
        setPhase('draft');
        flash('Reopened as draft');
      }
    }, "Reopen as draft");
  })();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-1)',
      border: `1px ${phase === 'closed' || phase === 'cancelled' ? 'solid' : 'dashed'} ${phase === 'cancelled' ? 'var(--danger)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--r-xl)',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: horiz ? 'row' : 'column',
      alignItems: horiz ? 'center' : 'stretch',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Lifecycle"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: m.color,
      padding: '3px 9px',
      borderRadius: 'var(--r-pill)',
      background: m.soft,
      border: `1px solid ${m.color}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), m.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-primary)',
      fontWeight: 300,
      lineHeight: 1.4
    }
  }, COPY[phase]), phase === 'cancelled' && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--danger)',
      marginTop: 6
    }
  }, "Reopen as a draft to run it again.")), action, /*#__PURE__*/React.createElement(EndEventDialog, {
    open: dialog,
    onEnd: () => {
      setDialog(false);
      setPhase('closed');
      flash('Event ended · recaps sent');
    },
    onCancel: () => {
      setDialog(false);
      setPhase('cancelled');
      flash('Event cancelled · attendees notified');
    },
    onClose: () => setDialog(false)
  }));
}
Object.assign(window, {
  A_PAL,
  aInit,
  aColor,
  AAvatar,
  AMono,
  APanel,
  AButton,
  AField,
  aInput,
  A_ROOM,
  A_CHIPS,
  A_MATCHES,
  PHASE_META,
  PhasePills,
  LifecycleSeam
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/admin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/panels.jsx
try { (() => {
/* ============================================================
   Admin — the back-office panels: Event setup & identity, lifecycle,
   check-in, chip moderation, matches, export.
   ============================================================ */
const {
  AAvatar,
  AMono,
  APanel,
  AButton,
  AField,
  aInput,
  A_ROOM,
  A_CHIPS,
  A_MATCHES
} = window;

/* Event creation + host identity. Identity is editable in draft only:
   locked while live, final once closed. The Event Layer rule, enforced. */
function EventSetup({
  onToast,
  phase = 'draft',
  actionAlign = 'center',
  actionFill = false
}) {
  const [name, setName] = React.useState('Creative Meetup');
  const [host, setHost] = React.useState('Futureland');
  const [acts, setActs] = React.useState({
    drop: true,
    chance: true,
    nudge: true
  });
  const toggle = k => setActs(a => ({
    ...a,
    [k]: !a[k]
  }));
  const locked = phase !== 'draft';
  const lockLine = phase === 'live' ? 'Locked while the event is live.' : phase === 'closed' ? 'Final. The event is a record.' : phase === 'cancelled' ? 'Final. The event was cancelled.' : null;
  const idInput = locked ? {
    ...aInput,
    color: 'var(--text-muted)',
    background: 'var(--surface-1)',
    cursor: 'not-allowed'
  } : aInput;
  return /*#__PURE__*/React.createElement(APanel, {
    title: "Event setup & host identity",
    right: locked && /*#__PURE__*/React.createElement(AMono, {
      style: {
        fontSize: 10,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        fontSize: 11
      }
    }, "\u26BF"), lockLine)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
      gap: '0 18px'
    }
  }, /*#__PURE__*/React.createElement(AField, {
    label: "Event name \xB7 required"
  }, /*#__PURE__*/React.createElement("input", {
    value: name,
    disabled: locked,
    "aria-disabled": locked,
    onChange: e => setName(e.target.value),
    style: idInput
  })), /*#__PURE__*/React.createElement(AField, {
    label: "Host name \xB7 required"
  }, /*#__PURE__*/React.createElement("input", {
    value: host,
    disabled: locked,
    "aria-disabled": locked,
    onChange: e => setHost(e.target.value),
    style: idInput
  })), /*#__PURE__*/React.createElement(AField, {
    label: "Date \xB7 required"
  }, /*#__PURE__*/React.createElement("input", {
    defaultValue: "Mar 14, 2026 \xB7 7:00pm",
    disabled: locked,
    "aria-disabled": locked,
    style: idInput
  })), /*#__PURE__*/React.createElement(AField, {
    label: "Host logo \xB7 optional"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      ...{}
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      ...idInput,
      display: 'flex',
      alignItems: 'center',
      color: 'var(--text-faint)'
    }
  }, "No logo \xB7 host name shown in type"), /*#__PURE__*/React.createElement(AButton, {
    variant: "ghost",
    size: "sm",
    icon: "\u2191",
    disabled: locked
  }, "Upload")))), /*#__PURE__*/React.createElement(AField, {
    label: "Acts enabled"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, [['drop', 'The Drop'], ['chance', 'The Chance'], ['nudge', 'The Nudge']].map(([k, lb]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => toggle(k),
    style: {
      flex: 1,
      padding: '10px',
      borderRadius: 'var(--r-md)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      background: acts[k] ? 'var(--accent-soft)' : 'var(--surface-2)',
      color: acts[k] ? 'var(--accent)' : 'var(--text-muted)',
      border: `1px solid ${acts[k] ? 'var(--accent)' : 'var(--border-strong)'}`
    }
  }, acts[k] ? '● ' : '○ ', lb)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 6,
      flexWrap: 'wrap',
      justifyContent: actionAlign === 'center' ? 'center' : actionAlign === 'right' ? 'flex-end' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(AButton, {
    style: actionFill ? {
      flex: 1
    } : undefined,
    disabled: locked,
    onClick: () => onToast && onToast('Event saved as draft')
  }, "Save draft"), /*#__PURE__*/React.createElement(AButton, {
    variant: "ghost",
    style: actionFill ? {
      flex: 1
    } : undefined,
    onClick: () => onToast && onToast('Preview opened')
  }, "Preview attendee view")));
}

/* Check-in panel */
function CheckIn({
  onToast
}) {
  return /*#__PURE__*/React.createElement(APanel, {
    title: "Manual check-in"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 300,
      marginBottom: 16
    }
  }, "For a guest who needs help getting in. Writes a profile, same as a scan."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
      gap: '0 18px'
    }
  }, /*#__PURE__*/React.createElement(AField, {
    label: "Name"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Full name",
    style: aInput
  })), /*#__PURE__*/React.createElement(AField, {
    label: "Email"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "email@\u2026",
    style: aInput
  }))), /*#__PURE__*/React.createElement(AField, {
    label: "Role"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, ['Founder', 'Designer', 'Engineer', 'Investor'].map(r => /*#__PURE__*/React.createElement("span", {
    key: r,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      padding: '7px 12px',
      borderRadius: 'var(--r-pill)',
      border: '1px solid var(--border-strong)',
      background: 'var(--surface-2)',
      color: 'var(--text-secondary)',
      cursor: 'pointer'
    }
  }, r)))), /*#__PURE__*/React.createElement(AButton, {
    onClick: () => onToast && onToast('Guest checked in')
  }, "Check in guest"));
}

/* Chip queue moderation */
function ChipQueue({
  onToast
}) {
  const [queue, setQueue] = React.useState(window.A_CHIPS);
  const act = (i, ok) => {
    setQueue(q => q.filter((_, x) => x !== i));
    onToast && onToast(ok ? 'Chip approved' : 'Chip rejected');
  };
  return /*#__PURE__*/React.createElement(APanel, {
    title: "Chip queue & moderation",
    right: /*#__PURE__*/React.createElement(AMono, {
      style: {
        fontSize: 11,
        color: queue.length ? 'var(--accent)' : 'var(--text-muted)'
      }
    }, queue.length, " pending")
  }, queue.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '24px 0',
      color: 'var(--text-muted)',
      fontSize: 14
    }
  }, "Nothing to review. You are caught up.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, queue.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '11px 14px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      padding: '6px 12px',
      borderRadius: 'var(--r-pill)',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-strong)',
      color: 'var(--text-primary)'
    }
  }, c.text), /*#__PURE__*/React.createElement(AMono, {
    style: {
      flex: 1,
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, "by ", c.by), /*#__PURE__*/React.createElement(AButton, {
    size: "sm",
    onClick: () => act(i, true)
  }, "Approve"), /*#__PURE__*/React.createElement(AButton, {
    size: "sm",
    variant: "ghost",
    onClick: () => act(i, false)
  }, "Reject")))));
}

/* Matches panel */
function MatchesPanel({
  empty = false
}) {
  if (empty) return /*#__PURE__*/React.createElement(APanel, {
    title: "Matches"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 300,
      color: 'var(--text-muted)',
      padding: '20px 0'
    }
  }, "Nothing here yet. It fills as the event runs."));
  return /*#__PURE__*/React.createElement(APanel, {
    title: "Matches",
    right: /*#__PURE__*/React.createElement(AMono, {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, "top connector \xB7 Tasha")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, A_MATCHES.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '11px 14px'
    }
  }, /*#__PURE__*/React.createElement(AAvatar, {
    name: m.a,
    size: 32
  }), /*#__PURE__*/React.createElement(AMono, {
    style: {
      fontSize: 12,
      color: m.mutual ? 'var(--accent)' : 'var(--text-muted)'
    }
  }, m.mutual ? '⇄' : '→'), /*#__PURE__*/React.createElement(AAvatar, {
    name: m.b,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)'
    }
  }, m.a.split(' ')[0], " \xD7 ", m.b.split(' ')[0]), " \xB7 ", m.why), m.mutual && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '.5px',
      textTransform: 'uppercase',
      padding: '4px 9px',
      borderRadius: 'var(--r-pill)',
      background: 'var(--accent-soft)',
      color: 'var(--accent)'
    }
  }, "Mutual")))));
}

/* Export panel */
function ExportPanel({
  onToast,
  empty = false
}) {
  const [busy, setBusy] = React.useState(null);
  const exp = k => {
    setBusy(k);
    onToast && onToast('Preparing export…');
    setTimeout(() => {
      setBusy(null);
      onToast && onToast(k + ' exported');
    }, 900);
  };
  if (empty) return /*#__PURE__*/React.createElement(APanel, {
    title: "Export \xB7 Futureland owns its data"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 300,
      color: 'var(--text-muted)',
      padding: '20px 0'
    }
  }, "No data to export yet."));
  return /*#__PURE__*/React.createElement(APanel, {
    title: "Export \xB7 Futureland owns its data"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 300,
      marginBottom: 16
    }
  }, "Pull the full record after the event. This is where Futureland's ownership of its event data is exercised."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, ['Attendees', 'Connections', 'Surveys'].map(k => /*#__PURE__*/React.createElement(AButton, {
    key: k,
    variant: "ghost",
    icon: "\u2193",
    disabled: busy,
    onClick: () => exp(k)
  }, busy === k ? 'Preparing…' : k))));
}

/* QR code generator panel — builds the per-event check-in QR + the
   standalone display page (open / print / download PNG / copy link). */
function QRPanel({
  onToast
}) {
  const [host, setHost] = React.useState('Futureland');
  const [event, setEvent] = React.useState('Creative Meetup');
  const [code, setCode] = React.useState('SODA-7F3K');
  const slug = (host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event') + '-' + code.toLowerCase();
  const url = 'https://soda.live/e/' + slug;
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    let alive = true;
    const draw = () => {
      if (!alive) return;
      if (!window.QRCode || !canvasRef.current) {
        setTimeout(draw, 150);
        return;
      }
      window.QRCode.toCanvas(canvasRef.current, url, {
        width: 288,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#111111',
          light: '#ffffff'
        }
      }, () => {
        if (canvasRef.current) {
          canvasRef.current.style.width = '144px';
          canvasRef.current.style.height = '144px';
        }
      });
    };
    draw();
    return () => {
      alive = false;
    };
  }, [url]);
  const displayHref = () => 'qr-display.html?' + new URLSearchParams({
    host,
    event,
    code,
    url
  }).toString();
  const openPage = () => window.open(displayHref(), '_blank');
  const printPage = () => {
    const w = window.open(displayHref(), '_blank');
    if (w) {
      const t = setInterval(() => {
        try {
          if (w.document.readyState === 'complete') {
            clearInterval(t);
            setTimeout(() => w.print(), 400);
          }
        } catch (e) {
          clearInterval(t);
        }
      }, 200);
    }
    onToast && onToast('Opening print view…');
  };
  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = 'soda-qr-' + slug + '.png';
    a.click();
    onToast && onToast('QR downloaded');
  };
  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(url);
    onToast && onToast('Join link copied');
  };
  const fld = {
    width: '100%',
    background: 'var(--surface-2)',
    border: '1px solid var(--border-strong)',
    borderRadius: 'var(--r-sm)',
    padding: '10px 12px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    outline: 'none'
  };
  return /*#__PURE__*/React.createElement(APanel, {
    title: "Check-in QR \xB7 per event"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      fontWeight: 300,
      marginBottom: 18
    }
  }, "Every event gets its own QR. Attendees scan it at the door to check in and build their card. Open the display page on a screen at the entrance, or print it for the table."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--r-lg)',
      padding: 14,
      width: 172,
      height: 172,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      width: 144,
      height: 144,
      imageRendering: 'pixelated'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      marginTop: 10,
      textAlign: 'center',
      width: 172
    }
  }, "Scannable preview")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))',
      gap: '0 14px'
    }
  }, /*#__PURE__*/React.createElement(AField, {
    label: "Host name"
  }, /*#__PURE__*/React.createElement("input", {
    value: host,
    onChange: e => setHost(e.target.value),
    style: fld
  })), /*#__PURE__*/React.createElement(AField, {
    label: "Entry code"
  }, /*#__PURE__*/React.createElement("input", {
    value: code,
    onChange: e => setCode(e.target.value.toUpperCase()),
    style: fld
  }))), /*#__PURE__*/React.createElement(AField, {
    label: "Join link \xB7 encoded in the QR"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...fld,
      display: 'flex',
      alignItems: 'center',
      color: 'var(--accent)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  }, url)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(AButton, {
    icon: "\u2922",
    onClick: openPage
  }, "Open display page"), /*#__PURE__*/React.createElement(AButton, {
    variant: "ghost",
    icon: "\u2399",
    onClick: printPage
  }, "Print"), /*#__PURE__*/React.createElement(AButton, {
    variant: "ghost",
    icon: "\u2193",
    onClick: download
  }, "PNG"), /*#__PURE__*/React.createElement(AButton, {
    variant: "ghost",
    icon: "\u29C9",
    onClick: copy
  }, "Copy link")))));
}
Object.assign(window, {
  EventSetup,
  CheckIn,
  ChipQueue,
  MatchesPanel,
  ExportPanel,
  QRPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/panels.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/attendee/home.jsx
try { (() => {
/* ============================================================
   Attendee — The between-events Home: profile header + three tabs
   (Overview / Events / Contacts rolodex). Warmth & follow-up nudges.
   ============================================================ */

const HOME_EVENTS = [{
  host: 'Futureland',
  name: 'Creative Meetup',
  date: 'Mar 14',
  where: 'Cleveland',
  met: 12
}, {
  host: 'Equalpoint',
  name: 'Founder Mixer',
  date: 'Feb 02',
  where: 'Cleveland',
  met: 8
}, {
  host: 'Black Tech Week',
  name: 'BTW Activation',
  date: 'Jan 20',
  where: 'Cincinnati',
  met: 15
}];
const HOME_CONTACTS = [{
  name: 'Jordan Blake',
  role: 'Investor',
  ev: 'Creative Meetup',
  where: 'Cleveland',
  signal: 'saved',
  warm: 'var(--accent)'
}, {
  name: 'Priya Nair',
  role: 'Designer',
  ev: 'Creative Meetup',
  where: 'Cleveland',
  signal: 'reached',
  warm: 'var(--accent)'
}, {
  name: 'Tasha Boyd',
  role: 'Founder',
  ev: 'Creative Meetup',
  where: 'Cleveland',
  signal: 'nudge',
  warm: 'var(--private)'
}, {
  name: 'Leo Kim',
  role: 'Engineer',
  ev: 'BTW Activation',
  where: 'Cincinnati',
  signal: 'nudge',
  warm: 'var(--text-muted)'
}, {
  name: 'Devon Carter',
  role: 'Growth Lead',
  ev: 'Founder Mixer',
  where: 'Cleveland',
  signal: 'just',
  warm: 'var(--accent)'
}, {
  name: 'Ana Reyes',
  role: 'Operator',
  ev: 'BTW Activation',
  where: 'Cincinnati',
  signal: 'just',
  warm: 'var(--text-muted)'
}];
const SIG_LABEL = {
  reached: 'Reached out',
  nudge: 'Reach out',
  saved: 'Saved',
  just: 'Just met'
};
function sigStyle(s) {
  return {
    reached: {
      color: 'var(--accent)',
      background: 'var(--accent-soft)'
    },
    nudge: {
      color: 'var(--private)',
      background: 'var(--private-soft)'
    },
    saved: {
      color: 'var(--text-muted)',
      background: 'var(--surface-2)'
    },
    just: {
      color: 'var(--text-muted)',
      background: 'var(--surface-2)'
    }
  }[s];
}
function Signal({
  s
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '.5px',
      textTransform: 'uppercase',
      padding: '4px 9px',
      borderRadius: 'var(--r-pill)',
      whiteSpace: 'nowrap',
      ...sigStyle(s)
    }
  }, SIG_LABEL[s]);
}
function CRow({
  c,
  onClick,
  warm,
  boxed
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: boxed ? '11px 13px' : '9px 0',
      background: boxed ? 'var(--surface-1)' : 'transparent',
      border: boxed ? '1px solid var(--border)' : 'none',
      borderRadius: boxed ? 'var(--r-md)' : 0,
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      minHeight: 44
    }
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: c.name,
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)',
      lineHeight: 1.1
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      marginTop: 2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, c.role, " \xB7 ", c.ev, ", ", c.where)), warm && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: c.warm
    }
  }), /*#__PURE__*/React.createElement(Signal, {
    s: c.signal
  }));
}
function Sec({
  title,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '6px 0 11px'
    }
  }, /*#__PURE__*/React.createElement(MonoLabel, null, title), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--accent)'
    }
  }, action));
}
function Home() {
  const [tab, setTab] = React.useState('overview');
  const [ovOpen, setOvOpen] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const nudges = HOME_CONTACTS.filter(c => c.signal === 'nudge');
  const tabs = [['overview', '■', 'Overview'], ['events', '▦', 'Events'], ['contacts', '◎', 'Contacts']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      padding: '12px 16px 14px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: "Maya Chen",
    size: 46
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: 'var(--text-primary)',
      lineHeight: 1.1
    }
  }, "Maya Chen"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Founder")), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Settings",
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      border: '1px solid var(--border-strong)',
      background: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontSize: 16,
      cursor: 'pointer',
      flex: '0 0 auto'
    }
  }, "\u2699"))), /*#__PURE__*/React.createElement("div", {
    className: "soda-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '18px',
      minHeight: 0
    }
  }, tab === 'overview' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Display, {
    size: 24,
    style: {
      marginBottom: 18
    }
  }, "Welcome back,", /*#__PURE__*/React.createElement("br", null), "Maya"), /*#__PURE__*/React.createElement(Sec, {
    title: "Recent events",
    action: "See all",
    onAction: () => setTab('events')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      overflowX: 'auto',
      paddingBottom: 6,
      marginBottom: 20
    },
    className: "soda-scroll"
  }, HOME_EVENTS.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: '0 0 auto',
      width: 150,
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: 6
    }
  }, e.host), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)',
      lineHeight: 1.15,
      marginBottom: 8
    }
  }, e.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, e.date, " \xB7 ", e.met, " met")))), /*#__PURE__*/React.createElement(Sec, {
    title: "People you synced with",
    action: "See all",
    onAction: () => setTab('contacts')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      overflowX: 'auto',
      paddingBottom: 6,
      marginBottom: 22
    },
    className: "soda-scroll"
  }, HOME_CONTACTS.slice(0, 6).map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: '0 0 auto',
      width: 62,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: c.name,
    size: 54,
    style: {
      margin: '0 auto 6px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, c.name.split(' ')[0])))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-green)',
      borderRadius: 'var(--r-xl)',
      padding: '16px 17px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--accent-bright)',
      marginBottom: 8
    }
  }, "Your experience"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      color: 'var(--text-primary)',
      fontWeight: 300,
      lineHeight: 1.4
    }
  }, "You came to find ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600,
      color: '#fff'
    }
  }, "engineers"), " and ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600,
      color: '#fff'
    }
  }, "pre-seed"), ". Three people from your events fit. Tap Contacts to follow up."))), tab === 'events' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Sec, {
    title: "Events attended"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, HOME_EVENTS.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '13px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: 40,
      height: 40,
      borderRadius: 'var(--r-sm)',
      background: 'var(--surface-2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--accent)'
    }
  }, e.host.split(/\s+/).map(w => w[0]).join('').slice(0, 3)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, e.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 3
    }
  }, e.date, " \xB7 ", e.where)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 17,
      color: 'var(--accent)'
    }
  }, e.met), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, "met")))))), tab === 'contacts' && /*#__PURE__*/React.createElement(React.Fragment, null, ovOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: 15,
      marginBottom: 18,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOvOpen(false),
    "aria-label": "Dismiss follow-ups overview",
    style: {
      position: 'absolute',
      top: 4,
      right: 5,
      width: 44,
      height: 44,
      borderRadius: '50%',
      border: 'none',
      background: 'none',
      color: 'var(--text-muted)',
      fontSize: 16,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "\xD7"), /*#__PURE__*/React.createElement(MonoLabel, {
    style: {
      marginBottom: 13,
      paddingRight: 26
    }
  }, "Recently met & follow-ups"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-purple)',
      border: '1px solid var(--private-border)',
      borderRadius: 'var(--r-md)',
      padding: '11px 12px',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--private)',
      marginBottom: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--private)'
    }
  }), " People to reach out to"), nudges.map((c, i) => /*#__PURE__*/React.createElement(CRow, {
    key: i,
    c: c,
    warm: true,
    boxed: false
  }))), HOME_CONTACTS.slice(0, 3).map((c, i) => /*#__PURE__*/React.createElement(CRow, {
    key: i,
    c: c,
    warm: true,
    boxed: false,
    style: {
      borderTop: '1px solid var(--border)'
    }
  }))), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Search contacts\u2026",
    style: {
      ...inStyle,
      borderColor: 'var(--border-strong)',
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, HOME_CONTACTS.filter(c => !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.role.toLowerCase().includes(query.toLowerCase())).map((c, i) => /*#__PURE__*/React.createElement(CRow, {
    key: i,
    c: c,
    warm: true,
    boxed: true
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      borderTop: '1px solid var(--border)',
      background: '#0e0f0e'
    }
  }, tabs.map(([id, ic, lb]) => {
    const on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setTab(id),
      "aria-current": on ? 'page' : undefined,
      style: {
        flex: 1,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '11px 0 13px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        color: on ? 'var(--accent)' : 'var(--text-muted)',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        lineHeight: 1
      }
    }, ic), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '.5px',
        textTransform: 'uppercase'
      }
    }, lb), id === 'contacts' && nudges.length > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 7,
        right: '50%',
        marginRight: -22,
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--private)'
      }
    }));
  })));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/attendee/home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/attendee/onboarding.jsx
try { (() => {
/* ============================================================
   Attendee — Onboarding spine: Welcome, Recognition, Sign-In,
   Code, Photo, and the three chip steps (Role / Offer / Need).
   ============================================================ */

const HOST = 'Futureland';
const EVENT = 'Creative Meetup';

/* 1 · Welcome (new guest) */
function Welcome({
  onBegin
}) {
  return /*#__PURE__*/React.createElement(CenterScreen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 0,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(HostMark, {
    host: HOST,
    sub: EVENT,
    size: 26
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 34
    }
  }), /*#__PURE__*/React.createElement(Display, {
    size: 34,
    style: {
      maxWidth: 280
    }
  }, "You made it in"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-secondary)',
      marginTop: 14,
      maxWidth: 260
    }
  }, "Ninety seconds to build your card, then you are in the room with everyone here tonight.")), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    size: "lg",
    onClick: onBegin
  }, "Begin"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 14,
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '1.5px',
      color: 'var(--text-faint)',
      textTransform: 'uppercase'
    }
  }, "SODA \u2726 powered by Equalpoint"));
}

/* 1b · Returning Guest Recognition */
function Recognition({
  onEnter
}) {
  return /*#__PURE__*/React.createElement(CenterScreen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Welcome back"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/React.createElement(KAvatar, {
    name: "Maya Chen",
    size: 88
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 18
    }
  }), /*#__PURE__*/React.createElement(Display, {
    size: 28
  }, "Good to see you,", /*#__PURE__*/React.createElement("br", null), "Maya"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-secondary)',
      marginTop: 14,
      maxWidth: 280
    }
  }, "This is your ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fff',
      fontWeight: 600
    }
  }, "third event"), ". You have made ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fff',
      fontWeight: 600
    }
  }, "seven connections"), " so far.")), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    size: "lg",
    onClick: onEnter
  }, "Enter the room"));
}

/* 2 · Sign-In — email code plus social, per SODA-025 and SODA-033.
   No phone field: SODA collects no phone number, ever. */
/* Neutral monograms for the social options, not official logo assets. */
function GoogleMark() {
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      color: '#1a1a1a',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      lineHeight: 1
    }
  }, "G");
}
function AppleMark() {
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      color: '#1a1a1a',
      fontSize: 12,
      lineHeight: 1,
      paddingBottom: 1
    }
  }, "\uF8FF");
}
function LinkedInMark() {
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 18,
      height: 18,
      borderRadius: 4,
      background: '#fff',
      color: '#1a1a1a',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 10,
      lineHeight: 1
    }
  }, "in");
}
function SignIn({
  onVerified
}) {
  const [stage, setStage] = React.useState('entry'); // entry | code
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [err, setErr] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const target = email || 'maya@futureland.com';
  const sendCode = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStage('code');
    }, 650);
  };
  const cells = Array.from({
    length: 6
  });
  const onCode = v => {
    const n = v.replace(/\D/g, '').slice(0, 6);
    setCode(n);
    setErr(false);
    if (n.length === 6) {
      if (n === '417203') {
        setTimeout(onVerified, 300);
      } else {
        setTimeout(() => setErr(true), 200);
      }
    }
  };
  return /*#__PURE__*/React.createElement(CenterScreen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      textAlign: 'center'
    }
  }, stage === 'entry' ? 'Sign in' : 'Check your email'), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 18
    }
  }), stage === 'entry' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Display, {
    size: 24,
    style: {
      textAlign: 'center'
    }
  }, "Who's here?"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontWeight: 300,
      fontSize: 14,
      color: 'var(--text-muted)',
      margin: '10px 0 22px'
    }
  }, "No password. We email a six-digit code."), /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 6,
      display: 'block'
    }
  }, "Name"), /*#__PURE__*/React.createElement("input", {
    defaultValue: "Maya Chen",
    style: inStyle
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 6,
      display: 'block'
    }
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    inputMode: "email",
    placeholder: "you@email.com",
    style: inStyle
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '20px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, "or"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 9
    }
  }, [['Google', /*#__PURE__*/React.createElement(GoogleMark, {
    key: "g"
  })], ['Apple', /*#__PURE__*/React.createElement(AppleMark, {
    key: "a"
  })], ['LinkedIn', /*#__PURE__*/React.createElement(LinkedInMark, {
    key: "l"
  })]].map(([lb, mark]) => /*#__PURE__*/React.createElement(KButton, {
    key: lb,
    variant: "ghost",
    icon: mark,
    onClick: onVerified,
    style: {
      flex: 1,
      paddingLeft: 8,
      paddingRight: 8
    }
  }, lb)))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Display, {
    size: 24,
    style: {
      textAlign: 'center'
    }
  }, "Enter the code"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontWeight: 300,
      fontSize: 14,
      color: 'var(--text-muted)',
      margin: '10px 0 24px'
    }
  }, "Sent to ", target, ". ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "(try 417203)")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: code,
    onChange: e => onCode(e.target.value),
    inputMode: "numeric",
    autoFocus: true,
    "aria-label": "Six-digit code",
    style: {
      position: 'absolute',
      opacity: 0,
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'center'
    }
  }, cells.map((_, i) => {
    const active = i === Math.min(code.length, 5) && code.length < 6;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 44,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-1)',
        borderRadius: 'var(--r-md)',
        fontFamily: 'var(--font-mono)',
        fontSize: 24,
        color: 'var(--text-primary)',
        border: `1px solid ${err ? 'var(--danger)' : active ? 'var(--accent)' : 'var(--border-strong)'}`
      }
    }, code[i] || '');
  }))), err && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--danger)',
      fontSize: 13,
      textAlign: 'center',
      marginTop: 14
    }
  }, "That code did not match. Check your email or resend."))), stage === 'entry' ? /*#__PURE__*/React.createElement(KButton, {
    block: true,
    size: "lg",
    disabled: sending || !email,
    onClick: sendCode
  }, sending ? 'Sending your code…' : 'Email me a code') : /*#__PURE__*/React.createElement(KButton, {
    block: true,
    variant: "ghost",
    onClick: () => {
      setErr(false);
      setCode('');
    }
  }, "Resend code"));
}
const inStyle = {
  width: '100%',
  background: 'var(--surface-1)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--r-sm)',
  padding: '12px 13px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: 15,
  outline: 'none'
};

/* 3 · Photo */
function Photo({
  onNext
}) {
  const [uploaded, setUploaded] = React.useState(false);
  return /*#__PURE__*/React.createElement(CenterScreen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Your card"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setUploaded(true),
    "aria-label": uploaded ? 'Change photo' : 'Add a photo',
    style: {
      cursor: 'pointer',
      position: 'relative',
      background: 'none',
      border: 'none',
      padding: 0,
      borderRadius: '50%'
    }
  }, uploaded ? /*#__PURE__*/React.createElement(KAvatar, {
    name: "Maya Chen",
    size: 120
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 120,
      borderRadius: '50%',
      border: '2px dashed var(--border-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontSize: 30
    }
  }, "\uFF0B")), /*#__PURE__*/React.createElement(Display, {
    size: 22,
    style: {
      marginTop: 24
    }
  }, "Add a photo"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 14,
      color: 'var(--text-muted)',
      marginTop: 10,
      maxWidth: 260
    }
  }, uploaded ? 'Looking good. Or skip — your initials work too.' : 'Optional. Skip and we use your initials.')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(KButton, {
    block: true,
    size: "lg",
    onClick: onNext
  }, uploaded ? 'Use this photo' : 'Add a photo'), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    variant: "ghost",
    onClick: onNext
  }, "Skip for now")));
}

/* 4 · Chip step (reused for Role / Offer / Need) */
function ChipStep({
  step,
  title,
  sub,
  options,
  multi,
  value,
  setValue,
  onNext,
  max = 3
}) {
  const atCap = multi && value.length >= max;
  const toggle = o => {
    if (multi) {
      if (value.includes(o)) setValue(value.filter(x => x !== o));else if (value.length < max) setValue([...value, o]);
    } else {
      setValue([o]);
    }
  };
  const count = value.length;
  return /*#__PURE__*/React.createElement(ScreenBody, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, `Step ${step} of 3`), multi && /*#__PURE__*/React.createElement(MonoLabel, {
    style: {
      color: count > 0 ? 'var(--accent)' : 'var(--text-muted)'
    }
  }, count, " of ", max)), /*#__PURE__*/React.createElement(Display, {
    size: 24,
    style: {
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 14,
      color: 'var(--text-muted)',
      marginBottom: 20
    }
  }, sub, multi ? ` Pick up to ${max}.` : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 9,
      flex: 1,
      alignContent: 'flex-start'
    }
  }, options.map(o => {
    const sel = value.includes(o);
    const locked = atCap && !sel;
    return /*#__PURE__*/React.createElement(KChip, {
      key: o,
      selected: sel,
      onClick: () => toggle(o),
      style: locked ? {
        opacity: .4,
        cursor: 'default'
      } : undefined
    }, o);
  }), /*#__PURE__*/React.createElement(KChip, {
    writeIn: true,
    style: atCap ? {
      opacity: .4,
      cursor: 'default'
    } : undefined
  }, "Add your own")), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    size: "lg",
    disabled: count === 0,
    onClick: onNext,
    style: {
      marginTop: 18
    }
  }, step < 3 ? 'Continue' : 'Enter the room'));
}
Object.assign(window, {
  HOST,
  EVENT,
  Welcome,
  Recognition,
  SignIn,
  Photo,
  ChipStep
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/attendee/onboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/attendee/room.jsx
try { (() => {
/* ============================================================
   Attendee — The Room + the three live Acts.
   RoomView (grid / list / flip, live count) and the act overlays:
   The Drop (waiting wall → answers), The Chance (pairing + timer),
   The Nudge (private match, purple).
   ============================================================ */

/* ---- A person card (grid) ---- */
function PersonCard({
  p,
  onComment
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onComment,
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: 13,
      cursor: 'pointer',
      transition: 'border-color .15s',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      width: '100%',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'var(--accent)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'var(--border)'
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: p.name,
    size: 42
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)',
      lineHeight: 1.1
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      marginTop: 3
    }
  }, p.role)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "Offers"), " ", p.offer), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--private)'
    }
  }, "Needs"), " ", p.need)));
}

/* ---- A dimmed placeholder card: the early room's promise of people ---- */
function PlaceholderCard() {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      background: 'var(--surface-1)',
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--r-lg)',
      padding: 13,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      opacity: .4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: '50%',
      background: 'var(--surface-2)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 11,
      width: '62%',
      background: 'var(--surface-2)',
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      width: '40%',
      background: 'var(--surface-2)',
      borderRadius: 4,
      marginTop: 7
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      width: '78%',
      background: 'var(--surface-2)',
      borderRadius: 4,
      marginTop: 2
    }
  }));
}

/* ---- Room View ---- */
/* `early` renders the most important empty state in the app: a count
   that climbs, one warm line, the few real cards, dimmed placeholders. */
function RoomView({
  onComment,
  headerSlot,
  early = false
}) {
  const [view, setView] = React.useState('grid'); // grid | list | flip
  const [flip, setFlip] = React.useState(0);
  const [count, setCount] = React.useState(early ? 2 : ROOM.length);
  React.useEffect(() => {
    if (!early) return undefined;
    const id = setInterval(() => setCount(c => c < 5 ? c + 1 : c), 2400);
    return () => clearInterval(id);
  }, [early]);
  const people = early ? ROOM.slice(0, count) : ROOM;
  const views = [['grid', '▦'], ['list', '≣'], ['flip', '❑']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      padding: '10px 16px 12px',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, EVENT), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--accent)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--accent)',
      boxShadow: '0 0 8px var(--accent)'
    }
  }), people.length, " HERE")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 12
    }
  }, views.map(([id, ic]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setView(id),
    "aria-pressed": view === id,
    style: {
      flex: 1,
      minHeight: 44,
      padding: '7px 0',
      borderRadius: 'var(--r-sm)',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      background: view === id ? 'var(--accent-soft)' : 'transparent',
      color: view === id ? 'var(--accent)' : 'var(--text-muted)',
      border: `1px solid ${view === id ? 'var(--accent)' : 'var(--border)'}`
    }
  }, ic, " ", id)))), /*#__PURE__*/React.createElement("div", {
    className: "soda-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      minHeight: 0
    }
  }, headerSlot, early && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '10px 0 18px'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: 20
  }, "The room is filling.", /*#__PURE__*/React.createElement("br", null), "You are early. Good.")), view === 'grid' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, people.map((p, i) => /*#__PURE__*/React.createElement(PersonCard, {
    key: i,
    p: p,
    onComment: () => onComment(p)
  })), early && Array.from({
    length: Math.max(0, 8 - people.length)
  }).map((_, i) => /*#__PURE__*/React.createElement(PlaceholderCard, {
    key: 'ph' + i
  }))), view === 'list' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, people.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => onComment(p),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '11px 13px',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: p.name,
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, p.role, " \xB7 offers ", p.offer)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontSize: 18
    },
    "aria-hidden": "true"
  }, "\u203A")))), view === 'flip' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: '28px 22px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: ROOM[flip].name,
    size: 84,
    style: {
      margin: '0 auto'
    }
  }), /*#__PURE__*/React.createElement(Display, {
    size: 22,
    style: {
      marginTop: 16
    }
  }, ROOM[flip].name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, ROOM[flip].role), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 18,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--accent)',
      fontFamily: 'var(--font-mono)',
      textTransform: 'uppercase'
    }
  }, "Offers"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 3
    }
  }, ROOM[flip].offer)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--private)',
      fontFamily: 'var(--font-mono)',
      textTransform: 'uppercase'
    }
  }, "Needs"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 3
    }
  }, ROOM[flip].need)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(KButton, {
    variant: "ghost",
    onClick: () => setFlip((flip - 1 + ROOM.length) % ROOM.length),
    icon: "\u2190"
  }, "Prev"), /*#__PURE__*/React.createElement(KButton, {
    variant: "ghost",
    onClick: () => setFlip((flip + 1) % ROOM.length)
  }, "Next \u2192")), /*#__PURE__*/React.createElement(MonoLabel, null, flip + 1, " / ", ROOM.length))));
}

/* ---- Act 1 · The Drop ---- */
/* After you send, the wall starts empty and answers land one at a time.
   The first beat is the waiting wall: yours alone, framed as first. */
function TheDrop({
  onDone
}) {
  const PROMPT = 'What did you make this week?';
  const [answered, setAnswered] = React.useState(false);
  const [text, setText] = React.useState('');
  const [revealed, setRevealed] = React.useState(false);
  const [landed, setLanded] = React.useState(0);
  React.useEffect(() => {
    if (!answered) return undefined;
    const id = setInterval(() => setLanded(n => n < DROP_ANSWERS.length ? n + 1 : n), 1800);
    return () => clearInterval(id);
  }, [answered]);
  return /*#__PURE__*/React.createElement(CenterScreen, null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      textAlign: 'center'
    }
  }, "The Drop"), /*#__PURE__*/React.createElement(Display, {
    size: 26,
    style: {
      textAlign: 'center',
      marginTop: 18
    }
  }, PROMPT), !answered ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "Answers are landing. Yours can be first.",
    rows: 3,
    style: {
      ...inStyle,
      resize: 'none',
      fontSize: 16,
      lineHeight: 1.4
    }
  })), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    size: "lg",
    disabled: !text.trim(),
    onClick: () => setAnswered(true)
  }, "Send it")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "soda-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      marginTop: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(MonoLabel, {
    style: {
      marginBottom: 4
    }
  }, revealed ? 'The wall' : 'On the wall · anonymous'), [text, ...DROP_ANSWERS.slice(0, landed)].map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: i === 0 ? 'var(--surface-green)' : 'var(--surface-1)',
      border: i === 0 ? 'none' : '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '12px 13px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-primary)',
      fontWeight: 300
    }
  }, a || '…'), revealed && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, i === 0 ? 'You' : ROOM[i].name))), landed === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontWeight: 300,
      fontSize: 13,
      color: 'var(--text-muted)',
      padding: '14px 0'
    }
  }, "Answers are landing. Yours is first.")), landed > 0 && !revealed ? /*#__PURE__*/React.createElement(KButton, {
    block: true,
    onClick: () => setRevealed(true)
  }, "Reveal names") : /*#__PURE__*/React.createElement(KButton, {
    block: true,
    variant: "ghost",
    onClick: onDone
  }, "Back to the room")));
}

/* ---- Act 2 · The Chance ---- */
function TheChance({
  onDone
}) {
  const partner = ROOM[2];
  const [t, setT] = React.useState(120);
  React.useEffect(() => {
    const id = setInterval(() => setT(x => x > 0 ? x - 1 : 0), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(t / 60)).padStart(1, '0'),
    ss = String(t % 60).padStart(2, '0');
  return /*#__PURE__*/React.createElement(CenterScreen, {
    bg: "var(--bg-deep)"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      textAlign: 'center',
      color: 'var(--text-muted)'
    }
  }, "The Chance"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: 22
  }, "Go meet"), /*#__PURE__*/React.createElement(KAvatar, {
    name: partner.name,
    size: 96,
    style: {
      margin: '20px 0 14px'
    }
  }), /*#__PURE__*/React.createElement(Display, {
    size: 26
  }, partner.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, partner.role), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '13px 15px',
      marginTop: 22,
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      marginBottom: 6
    }
  }, "Starter \xB7 from the Drop"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-primary)',
      fontWeight: 300
    }
  }, "Ask them about the studio in an old bakery.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 44,
      color: 'var(--warn)',
      marginTop: 26,
      letterSpacing: '.02em'
    }
  }, mm, ":", ss), /*#__PURE__*/React.createElement(MonoLabel, {
    style: {
      color: 'var(--warn)'
    }
  }, "on the clock")), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    variant: "ghost",
    onClick: onDone
  }, "We talked"));
}

/* ---- Act 3 · The Nudge (private) ---- */
/* `noMatch` is the graceful fallback: same private purple treatment,
   a held nudge instead of a person. It never just vanishes. */
function TheNudge({
  onDone,
  noMatch = false
}) {
  const match = ROOM[0];
  if (noMatch) return /*#__PURE__*/React.createElement(CenterScreen, {
    bg: "var(--bg-deep)"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      textAlign: 'center',
      color: 'var(--private)'
    }
  }, "A nudge, for you"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 300,
      background: 'var(--surface-purple)',
      border: '1px dashed var(--private-border)',
      borderRadius: 'var(--r-xl)',
      padding: '26px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      borderRadius: '50%',
      border: '2px dashed var(--private-border)',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--private)',
      fontSize: 26
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      color: 'var(--text-primary)',
      fontWeight: 300,
      lineHeight: 1.5,
      marginTop: 18
    }
  }, "No single match stood out yet. The night is not over. Keep working the room."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--private-border)',
      margin: '16px 0'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--private)',
      fontWeight: 300
    }
  }, "If one appears, it lands right here.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)',
      marginTop: 16,
      maxWidth: 260
    }
  }, "Seen only by you. Nothing public, no announcement.")), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    variant: "ghost",
    onClick: onDone
  }, "Back to the room"));
  return /*#__PURE__*/React.createElement(CenterScreen, {
    bg: "var(--bg-deep)"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      textAlign: 'center',
      color: 'var(--private)'
    }
  }, "A nudge, for you"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 300,
      background: 'var(--surface-purple)',
      border: '1px solid var(--private-border)',
      borderRadius: 'var(--r-xl)',
      padding: '26px 22px'
    }
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: match.name,
    size: 84,
    style: {
      margin: '0 auto'
    }
  }), /*#__PURE__*/React.createElement(Display, {
    size: 24,
    style: {
      marginTop: 16
    }
  }, match.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, match.role), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--private-border)',
      margin: '18px 0'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      color: 'var(--text-primary)',
      fontWeight: 300,
      lineHeight: 1.45
    }
  }, "They have ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--private)',
      fontWeight: 600
    }
  }, "the capital"), " you came for, and you have the ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--private)',
      fontWeight: 600
    }
  }, "intros"), " they need. Find them before you leave.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)',
      marginTop: 16,
      maxWidth: 260
    }
  }, "Seen only by you. Nothing public, no announcement.")), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    onClick: onDone
  }, "Find them"));
}
Object.assign(window, {
  RoomView,
  TheDrop,
  TheChance,
  TheNudge
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/attendee/room.jsx", error: String((e && e.message) || e) }); }

// ui_kits/attendee/survey.jsx
try { (() => {
/* ============================================================
   Attendee — Post-event Survey (star / scale / tag / text) with a
   one-question-at-a-time flow and progress bar, then the Send-Off.
   ============================================================ */

const QS = [{
  kind: 'star',
  q: 'How was the night?'
}, {
  kind: 'scale',
  q: 'Did you find what you came for?',
  lo: 'Not really',
  hi: 'Absolutely'
}, {
  kind: 'tag',
  q: 'What did you come for?',
  opts: ['Collaborators', 'Capital', 'Customers', 'Hiring', 'Just curious', 'Inspiration']
}, {
  kind: 'text',
  q: 'Anything we should know?',
  placeholder: 'One line is plenty.'
}];
function Stars({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Rating, one to five stars",
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, [1, 2, 3, 4, 5].map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => onChange(n),
    "aria-label": `${n} star${n > 1 ? 's' : ''}`,
    "aria-pressed": n <= value,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 40,
      lineHeight: 1,
      minWidth: 44,
      minHeight: 44,
      color: n <= value ? 'var(--accent)' : 'var(--border-strong)',
      transition: 'color .12s'
    }
  }, "\u2605")));
}
function Scale({
  value,
  onChange,
  lo,
  hi
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": `Scale of 1 to 7, from ${lo} to ${hi}`,
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'center'
    }
  }, [1, 2, 3, 4, 5, 6, 7].map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => onChange(n),
    "aria-pressed": n === value,
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--r-sm)',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      background: n === value ? 'var(--accent)' : 'var(--surface-1)',
      color: n === value ? 'var(--on-accent)' : 'var(--text-secondary)',
      border: `1px solid ${n === value ? 'var(--accent)' : 'var(--border-strong)'}`
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.5px'
    }
  }, /*#__PURE__*/React.createElement("span", null, lo), /*#__PURE__*/React.createElement("span", null, hi)));
}
function Survey({
  onDone
}) {
  const [i, setI] = React.useState(0);
  const [ans, setAns] = React.useState({});
  const q = QS[i];
  const set = v => setAns(a => ({
    ...a,
    [i]: v
  }));
  const v = ans[i];
  const can = q.kind === 'text' ? true : v != null && (q.kind !== 'tag' || v && v.length);
  const next = () => {
    if (i < QS.length - 1) setI(i + 1);else onDone();
  };
  return /*#__PURE__*/React.createElement(CenterScreen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => i > 0 && setI(i - 1),
    "aria-label": "Previous question",
    disabled: i === 0,
    style: {
      background: 'none',
      border: 'none',
      color: i > 0 ? 'var(--text-muted)' : 'var(--text-faint)',
      cursor: i > 0 ? 'pointer' : 'default',
      fontSize: 18,
      width: 44,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 6,
      background: 'var(--surface-2)',
      borderRadius: 'var(--r-pill)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${(i + 1) / QS.length * 100}%`,
      background: 'var(--accent)',
      borderRadius: 'var(--r-pill)',
      transition: 'width .3s'
    }
  })), /*#__PURE__*/React.createElement(MonoLabel, null, i + 1, "/", QS.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Display, {
    size: 24,
    style: {
      textAlign: 'center',
      marginBottom: 30
    }
  }, q.q), q.kind === 'star' && /*#__PURE__*/React.createElement(Stars, {
    value: v || 0,
    onChange: set
  }), q.kind === 'scale' && /*#__PURE__*/React.createElement(Scale, {
    value: v,
    onChange: set,
    lo: q.lo,
    hi: q.hi
  }), q.kind === 'tag' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 9,
      justifyContent: 'center'
    }
  }, q.opts.map(o => {
    const sel = (v || []).includes(o);
    return /*#__PURE__*/React.createElement(KChip, {
      key: o,
      selected: sel,
      onClick: () => set(sel ? (v || []).filter(x => x !== o) : [...(v || []), o])
    }, o);
  })), q.kind === 'text' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    value: v || '',
    onChange: e => set(e.target.value),
    placeholder: q.placeholder,
    rows: 3,
    maxLength: 140,
    style: {
      ...inStyle,
      resize: 'none',
      fontSize: 15,
      lineHeight: 1.4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-faint)',
      marginTop: 6
    }
  }, (v || '').length, "/140"))), /*#__PURE__*/React.createElement(KButton, {
    block: true,
    size: "lg",
    disabled: !can,
    onClick: next
  }, i < QS.length - 1 ? 'Next' : 'Finish'));
}

/* Send-Off */
function SendOff({
  onRestart
}) {
  return /*#__PURE__*/React.createElement(CenterScreen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(HostMark, {
    host: HOST,
    sub: EVENT
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement(Display, {
    size: 30,
    style: {
      maxWidth: 300
    }
  }, "Thanks for being in the room"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 300,
      fontSize: 15,
      color: 'var(--text-secondary)',
      marginTop: 16,
      maxWidth: 280
    }
  }, "Your recap is on the way. The next Futureland night is closer than you think."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement(KButton, {
    onClick: onRestart
  }, "Join the membership waitlist")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: 'var(--text-muted)',
      fontSize: 13,
      maxWidth: 300,
      margin: '0 auto'
    }
  }, "A name tag knows you showed up. SODA knows who you became to the room."));
}
Object.assign(window, {
  Survey,
  SendOff
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/attendee/survey.jsx", error: String((e && e.message) || e) }); }

// ui_kits/attendee/ui.jsx
try { (() => {
/* ============================================================
   SODA Attendee UI Kit — shared primitives, phone frame, seed data
   Self-contained (mirrors components/* using the same tokens) so the
   clickthrough renders standalone. Exports to window for sibling files.
   ============================================================ */

const PAL = ['var(--av-1)', 'var(--av-2)', 'var(--av-3)', 'var(--av-4)', 'var(--av-5)', 'var(--av-6)', 'var(--av-7)', 'var(--av-8)'];
function initials(n) {
  return (n || '').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
}
function colorFor(n) {
  let h = 0;
  for (let i = 0; i < (n || '').length; i++) h = h * 31 + n.charCodeAt(i) >>> 0;
  return PAL[h % PAL.length];
}

/* ---- Avatar ---- */
function KAvatar({
  name,
  size = 48,
  color,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.38),
      color: '#fff',
      background: color || colorFor(name),
      userSelect: 'none',
      ...(style || {})
    }
  }, initials(name));
}

/* ---- Eyebrow / labels ---- */
function Eyebrow({
  children,
  color = 'var(--accent)',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '3px',
      textTransform: 'uppercase',
      color,
      ...(style || {})
    }
  }, children);
}
function MonoLabel({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      ...(style || {})
    }
  }, children);
}
function Display({
  children,
  size = 26,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '-.01em',
      lineHeight: 1.02,
      color: 'var(--text-primary)',
      fontSize: size,
      ...(style || {})
    }
  }, children);
}

/* ---- Button ---- */
function KButton({
  children,
  variant = 'primary',
  size = 'md',
  block,
  disabled,
  icon,
  onClick,
  style
}) {
  const sizes = {
    sm: {
      padding: '9px 13px',
      fontSize: 13
    },
    md: {
      padding: '14px 16px',
      fontSize: 15
    },
    lg: {
      padding: '16px 18px',
      fontSize: 16
    }
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      border: '1px solid var(--accent)'
    },
    ghost: {
      background: 'var(--surface-1)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)'
    },
    purple: {
      background: 'var(--private-soft)',
      color: 'var(--private)',
      border: '1px solid var(--private-border)'
    },
    danger: {
      background: 'var(--danger-soft)',
      color: 'var(--danger)',
      border: '1px solid var(--danger)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    style: {
      width: block ? '100%' : 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      borderRadius: 'var(--r-md)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      lineHeight: 1.1,
      transition: 'filter .15s',
      ...sizes[size],
      ...variants[variant],
      ...(style || {})
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: '1.05em',
      lineHeight: 1
    }
  }, icon), children);
}

/* ---- Chip ---- */
function KChip({
  children,
  selected,
  onClick,
  writeIn,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 400,
      minHeight: 44,
      padding: '10px 16px',
      borderRadius: 'var(--r-pill)',
      cursor: 'pointer',
      transition: 'transform .12s var(--ease)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      backgroundColor: selected ? 'var(--accent)' : 'var(--surface-1)',
      color: selected ? 'var(--on-accent)' : 'var(--text-secondary)',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: selected ? 'var(--accent)' : 'var(--border-strong)',
      ...(style || {})
    }
  }, writeIn && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      opacity: 0.7
    }
  }, "\uFF0B"), children);
}

/* ---- Phone frame ----
   Fixed 380×780 device. The screen is a flex column: header / body / tabbar.
   `chrome` lets a screen suppress the status bar (full-bleed acts). */
function PhoneFrame({
  children,
  statusHost
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      maxWidth: '100%',
      background: '#000',
      border: '9px solid #1c1d1c',
      borderRadius: 'var(--r-device)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-device)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-canvas)',
      height: 780,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      height: 34,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: '1px'
    }
  }, statusHost || ''), /*#__PURE__*/React.createElement("span", null, "\u25CF \u25CF \u25CF")), children));
}

/* ---- Screen scaffold: scrolling body ---- */
function ScreenBody({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "soda-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '18px',
      ...(style || {})
    }
  }, children);
}

/* ---- Centered screen (welcome/sendoff/acts) ---- */
function CenterScreen({
  children,
  bg = 'var(--bg-canvas)',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 22px 28px',
      background: bg,
      ...(style || {})
    }
  }, children);
}

/* ---- Toast ---- */
function KToast({
  message,
  show,
  tone = 'green'
}) {
  const edge = {
    green: 'var(--accent)',
    purple: 'var(--private)',
    danger: 'var(--danger)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: 90,
      transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
      background: 'var(--surface-2)',
      border: `1px solid ${edge}`,
      color: 'var(--text-primary)',
      fontSize: 13,
      padding: '11px 18px',
      borderRadius: 'var(--r-pill)',
      boxShadow: 'var(--shadow-toast)',
      opacity: show ? 1 : 0,
      transition: 'all .3s',
      pointerEvents: 'none',
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: edge
    }
  }), message);
}

/* ---- Host identity block (wordmark / typed name) ---- */
function HostMark({
  host,
  sub,
  size = 20
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '-.01em',
      fontSize: size,
      color: 'var(--text-primary)'
    }
  }, host), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, sub));
}

/* ============================================================
   Seed data — one event ("Creative Meetup", hosted by Futureland)
   ============================================================ */
const ROLES = ['Founder', 'Designer', 'Engineer', 'Investor', 'Operator', 'Artist', 'Product', 'Marketer'];
const OFFERS = ['Intros', 'Advice', 'Hiring', 'Capital', 'Mentorship', 'Collab', 'Feedback'];
const NEEDS = ['Engineers', 'Pre-seed', 'Designers', 'Customers', 'Partners', 'Co-founder', 'Advisors'];
const ROOM = [{
  name: 'Jordan Blake',
  role: 'Investor',
  offer: 'Capital',
  need: 'Dealflow'
}, {
  name: 'Priya Nair',
  role: 'Designer',
  offer: 'Feedback',
  need: 'Customers'
}, {
  name: 'Marcus Webb',
  role: 'Engineer',
  offer: 'Hiring',
  need: 'Co-founder'
}, {
  name: 'Tasha Boyd',
  role: 'Founder',
  offer: 'Intros',
  need: 'Pre-seed'
}, {
  name: 'Devon Carter',
  role: 'Operator',
  offer: 'Advice',
  need: 'Partners'
}, {
  name: 'Ana Reyes',
  role: 'Product',
  offer: 'Collab',
  need: 'Engineers'
}, {
  name: 'Leo Kim',
  role: 'Engineer',
  offer: 'Mentorship',
  need: 'Customers'
}, {
  name: 'Simone Ford',
  role: 'Marketer',
  offer: 'Intros',
  need: 'Designers'
}, {
  name: 'Noah Pratt',
  role: 'Founder',
  offer: 'Hiring',
  need: 'Capital'
}, {
  name: 'Iris Chen',
  role: 'Artist',
  offer: 'Collab',
  need: 'Partners'
}, {
  name: 'Drew Ellis',
  role: 'Investor',
  offer: 'Capital',
  need: 'Founders'
}, {
  name: 'Kira Sol',
  role: 'Designer',
  offer: 'Feedback',
  need: 'Pre-seed'
}];
const DROP_ANSWERS = ['The one idea I can\'t stop thinking about', 'Shipping before I\'m ready', 'A studio in an old bakery', 'Trust the room', 'Less polish, more honesty', 'The first hire changed everything'];
Object.assign(window, {
  PAL,
  initials,
  colorFor,
  KAvatar,
  Eyebrow,
  MonoLabel,
  Display,
  KButton,
  KChip,
  PhoneFrame,
  ScreenBody,
  CenterScreen,
  KToast,
  HostMark,
  ROLES,
  OFFERS,
  NEEDS,
  ROOM,
  DROP_ANSWERS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/attendee/ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/command-center/cc.jsx
try { (() => {
/* ============================================================
   SODA Command Center — host live cockpit. Shell, seed data, and
   shared bits (stat bar, activity feed, connection badge, toast).
   Self-contained; same styles.css tokens. Exports to window.
   ============================================================ */
const CC_PAL = ['var(--av-1)', 'var(--av-2)', 'var(--av-3)', 'var(--av-4)', 'var(--av-5)', 'var(--av-6)', 'var(--av-7)', 'var(--av-8)'];
function ccInit(n) {
  return (n || '').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
}
function ccColor(n) {
  let h = 0;
  for (let i = 0; i < (n || '').length; i++) h = h * 31 + n.charCodeAt(i) >>> 0;
  return CC_PAL[h % CC_PAL.length];
}
function CCAvatar({
  name,
  size = 40,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.38),
      color: '#fff',
      background: ccColor(name),
      ...(style || {})
    }
  }, ccInit(name));
}
function Mono({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      ...(style || {})
    }
  }, children);
}
const CC_ROOM = [{
  name: 'Jordan Blake',
  role: 'Investor',
  offer: 'Capital',
  need: 'Dealflow'
}, {
  name: 'Priya Nair',
  role: 'Designer',
  offer: 'Feedback',
  need: 'Customers'
}, {
  name: 'Marcus Webb',
  role: 'Engineer',
  offer: 'Hiring',
  need: 'Co-founder'
}, {
  name: 'Tasha Boyd',
  role: 'Founder',
  offer: 'Intros',
  need: 'Pre-seed'
}, {
  name: 'Devon Carter',
  role: 'Operator',
  offer: 'Advice',
  need: 'Partners'
}, {
  name: 'Ana Reyes',
  role: 'Product',
  offer: 'Collab',
  need: 'Engineers'
}, {
  name: 'Leo Kim',
  role: 'Engineer',
  offer: 'Mentorship',
  need: 'Customers'
}, {
  name: 'Simone Ford',
  role: 'Marketer',
  offer: 'Intros',
  need: 'Designers'
}, {
  name: 'Noah Pratt',
  role: 'Founder',
  offer: 'Hiring',
  need: 'Capital'
}, {
  name: 'Iris Chen',
  role: 'Artist',
  offer: 'Collab',
  need: 'Partners'
}, {
  name: 'Drew Ellis',
  role: 'Investor',
  offer: 'Capital',
  need: 'Founders'
}, {
  name: 'Kira Sol',
  role: 'Designer',
  offer: 'Feedback',
  need: 'Pre-seed'
}];
const CC_FEED = [{
  t: 'now',
  who: 'Kira Sol',
  what: 'scanned in'
}, {
  t: '1m',
  who: 'Drew Ellis',
  what: 'answered the Drop'
}, {
  t: '2m',
  who: 'Marcus & Ana',
  what: 'paired up'
}, {
  t: '3m',
  who: 'Tasha Boyd',
  what: 'got a nudge'
}, {
  t: '4m',
  who: 'Iris Chen',
  what: 'scanned in'
}, {
  t: '5m',
  who: 'Leo Kim',
  what: 'answered the Drop'
}];

/* Stat bar */
function StatBar({
  stats
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      minWidth: 120,
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '14px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      lineHeight: 1,
      color: s.color || 'var(--accent)'
    }
  }, s.value), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: 'var(--text-muted)',
      marginTop: 6,
      display: 'block'
    }
  }, s.label))));
}

/* Connection badge + lifecycle state badge */
function LiveBadge({
  phase = 'live'
}) {
  if (phase === 'live') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--accent-soft)',
      border: '1px solid var(--accent)',
      borderRadius: 'var(--r-pill)',
      padding: '6px 13px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--accent)',
      boxShadow: '0 0 8px var(--accent)'
    }
  }), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 11,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "Live"));
  const label = phase === 'draft' ? 'Draft' : phase === 'cancelled' ? 'Cancelled' : 'Closed';
  const tone = phase === 'cancelled' ? 'var(--danger)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--surface-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-pill)',
      padding: '6px 13px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: tone
    }
  }), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 11,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: tone
    }
  }, label));
}

/* Lifecycle gate note: the one-line reason an act control is inert */
function GateNote({
  phase
}) {
  const line = phase === 'draft' ? 'The event is not live yet. Acts arm when the door opens.' : phase === 'cancelled' ? 'This event was cancelled. Acts are off.' : 'The event has ended. Acts are final.';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--text-muted)',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 11,
      letterSpacing: '0.5px',
      color: 'var(--text-muted)'
    }
  }, line));
}

/* Shared event phase: the Admin writes it, the Command Center reads it. */
const PHASE_KEY = 'soda.eventPhase';
function usePhase(fallback = 'live') {
  const [phase, set] = React.useState(() => {
    try {
      const v = localStorage.getItem(PHASE_KEY);
      return v === 'draft' || v === 'live' || v === 'closed' || v === 'cancelled' ? v : fallback;
    } catch (e) {
      return fallback;
    }
  });
  const setPhase = p => {
    set(p);
    try {
      localStorage.setItem(PHASE_KEY, p);
    } catch (e) {}
  };
  React.useEffect(() => {
    const on = e => {
      if (e.key === PHASE_KEY && e.newValue) set(e.newValue);
    };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);
  return [phase, setPhase];
}
function ConnBadge() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase'
    }
  }, "Synced"));
}

/* Activity feed */
function ActivityFeed({
  feed
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 10,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 12,
      display: 'block'
    }
  }, "Activity"), feed.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      fontWeight: 300,
      color: 'var(--text-muted)',
      margin: '6px 0'
    }
  }, "The night starts here."), feed.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 0',
      borderTop: i ? '1px solid var(--border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: i === 0 ? 'var(--accent)' : 'var(--border-strong)',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)',
      fontWeight: 600
    }
  }, f.who), " ", f.what), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 10,
      color: 'var(--text-faint)'
    }
  }, f.t))));
}

/* Panel wrapper */
function Panel({
  title,
  right,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: '18px 20px',
      ...(style || {})
    }
  }, (title || right) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 11,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, title), right), children);
}

/* Button (cockpit) */
function CCButton({
  children,
  variant = 'primary',
  onClick,
  disabled,
  icon,
  size = 'md',
  style
}) {
  const v = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      border: '1px solid var(--accent)'
    },
    ghost: {
      background: 'var(--surface-2)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)'
    },
    purple: {
      background: 'var(--private-soft)',
      color: 'var(--private)',
      border: '1px solid var(--private-border)'
    }
  }[variant];
  const sz = {
    sm: {
      padding: '8px 12px',
      fontSize: 13
    },
    md: {
      padding: '11px 16px',
      fontSize: 14
    }
  }[size];
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      borderRadius: 'var(--r-md)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...sz,
      ...v,
      ...(style || {})
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, icon), children);
}

/* Bar chart row (intelligence) */
function BarRow({
  label,
  value,
  max,
  color = 'var(--accent)'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 84,
      fontSize: 13,
      color: 'var(--text-secondary)',
      textAlign: 'right'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      background: 'var(--surface-2)',
      borderRadius: 'var(--r-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${value / max * 100}%`,
      background: color,
      borderRadius: 'var(--r-sm)',
      transition: 'width .4s'
    }
  })), /*#__PURE__*/React.createElement(Mono, {
    style: {
      width: 24,
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, value));
}
Object.assign(window, {
  CC_PAL,
  ccInit,
  ccColor,
  CCAvatar,
  Mono,
  CC_ROOM,
  CC_FEED,
  StatBar,
  LiveBadge,
  GateNote,
  usePhase,
  PHASE_KEY,
  ConnBadge,
  ActivityFeed,
  Panel,
  CCButton,
  BarRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/command-center/cc.jsx", error: String((e && e.message) || e) }); }

// ui_kits/command-center/views.jsx
try { (() => {
/* ============================================================
   Command Center — the act views. Each drives one part of the night.
   ============================================================ */
const {
  CCAvatar,
  Mono,
  CC_ROOM,
  Panel,
  CCButton,
  BarRow,
  GateNote
} = window;

/* Room View (host) */
function RoomHost({
  empty = false
}) {
  if (empty) return /*#__PURE__*/React.createElement(Panel, {
    title: "Room \xB7 0 present",
    right: /*#__PURE__*/React.createElement(Mono, {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, "monitoring")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
      gap: 10,
      opacity: .35
    },
    "aria-hidden": "true"
  }, Array.from({
    length: 6
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surface-2)',
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--r-md)',
      padding: 12,
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'var(--surface-1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10,
      width: '70%',
      background: 'var(--surface-1)',
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      width: '44%',
      background: 'var(--surface-1)',
      borderRadius: 4,
      marginTop: 6
    }
  }))))), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 300,
      color: 'var(--text-muted)',
      margin: '18px 0 6px'
    }
  }, "No one has scanned in yet. The room fills here."));
  return /*#__PURE__*/React.createElement(Panel, {
    title: `Room · ${CC_ROOM.length} present`,
    right: /*#__PURE__*/React.createElement(Mono, {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, "monitoring")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
      gap: 10
    }
  }, CC_ROOM.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: 12,
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(CCAvatar, {
    name: p.name,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, p.name), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, p.role))))));
}

/* Sync Control — drives The Drop */
function SyncControl({
  onToast,
  phase = 'live',
  empty = false
}) {
  const live = phase === 'live';
  const [prompt, setPrompt] = React.useState('What did you make this week?');
  const [fired, setFired] = React.useState(false);
  const [t, setT] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  React.useEffect(() => {
    if (!fired) return;
    const id = setInterval(() => {
      setT(x => x + 1);
      if (!empty) setCount(c => c < 11 ? c + 1 : c);
    }, 900);
    return () => clearInterval(id);
  }, [fired, empty]);
  const answers = ['Shipping before I was ready', 'A studio in an old bakery', 'Trust the room', 'The first hire changed everything', 'Less polish, more honesty'];
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Sync control \xB7 The Drop",
    right: fired && /*#__PURE__*/React.createElement(Mono, {
      style: {
        fontSize: 11,
        color: 'var(--accent)'
      }
    }, count, " responses")
  }, !fired ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 10,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      display: 'block',
      marginBottom: 7
    }
  }, "Prompt"), /*#__PURE__*/React.createElement("input", {
    value: prompt,
    onChange: e => setPrompt(e.target.value),
    style: {
      width: '100%',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--r-md)',
      padding: '12px 13px',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      outline: 'none',
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement(CCButton, {
    icon: "\u25C9",
    disabled: !live,
    onClick: () => {
      setFired(true);
      onToast && onToast('Drop fired to 12 phones');
    }
  }, "Fire the Drop"), !live && /*#__PURE__*/React.createElement(GateNote, {
    phase: phase
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 34,
      color: 'var(--accent)'
    }
  }, String(Math.floor(t / 60)).padStart(1, '0'), ":", String(t % 60).padStart(2, '0')), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 10,
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, "elapsed")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 15,
      color: 'var(--text-primary)',
      fontWeight: 300
    }
  }, "\u201C", prompt, "\u201D")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxHeight: 200,
      overflowY: 'auto'
    },
    className: "soda-scroll"
  }, count === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 300,
      color: 'var(--text-muted)',
      padding: '14px 0'
    }
  }, "Waiting on the first answer.") : answers.slice(0, Math.max(1, count - 6)).map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-sm)',
      padding: '10px 12px',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, a, " ", revealed && /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, "\xB7 ", CC_ROOM[i].name)))), count > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(CCButton, {
    variant: "ghost",
    size: "sm",
    onClick: () => {
      setRevealed(true);
      onToast && onToast('Names revealed');
    }
  }, "Reveal names"))));
}

/* Chance Control — drives pairing */
function ChanceControl({
  onToast,
  phase = 'live',
  empty = false
}) {
  const live = phase === 'live';
  const [spun, setSpun] = React.useState(false);
  const pairs = [[0, 2], [1, 5], [3, 8], [4, 6], [7, 11], [9, 10]];
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Chance control \xB7 pairing",
    right: spun && !empty && /*#__PURE__*/React.createElement(Mono, {
      style: {
        fontSize: 11,
        color: 'var(--accent)'
      }
    }, pairs.length, " pairs")
  }, empty ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '18px 0'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      fontWeight: 300,
      marginBottom: 6
    }
  }, "Room is small. One guest will hold for the next round."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)',
      fontWeight: 300
    }
  }, "Pairing opens up as more people scan in.")) : !spun ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '18px 0'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      fontWeight: 300,
      marginBottom: 18
    }
  }, "Pair the room by chance. Each pair gets a starter pulled from the Drop."), /*#__PURE__*/React.createElement(CCButton, {
    icon: "\u27F3",
    disabled: !live,
    onClick: () => {
      setSpun(true);
      onToast && onToast('Room paired · 6 pairs');
    }
  }, "Spin the room"), !live && /*#__PURE__*/React.createElement(GateNote, {
    phase: phase
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, pairs.map(([a, b], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '10px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(CCAvatar, {
    name: CC_ROOM[a].name,
    size: 30
  }), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 11,
      color: 'var(--accent)'
    }
  }, "\xD7"), /*#__PURE__*/React.createElement(CCAvatar, {
    name: CC_ROOM[b].name,
    size: 30
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 6,
      minWidth: 0,
      fontSize: 12,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, CC_ROOM[a].name.split(' ')[0], " & ", CC_ROOM[b].name.split(' ')[0])))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(CCButton, {
    variant: "ghost",
    size: "sm",
    icon: "\u27F3",
    onClick: () => onToast && onToast('Re-spun')
  }, "Re-spin"))));
}

/* Nudge Control — private matches */
function NudgeControl({
  onToast,
  phase = 'live',
  empty = false
}) {
  const live = phase === 'live';
  const init = empty ? [] : [{
    to: 'Tasha Boyd',
    match: 'Drew Ellis',
    why: 'has the capital she needs'
  }, {
    to: 'Marcus Webb',
    match: 'Noah Pratt',
    why: 'is hiring engineers'
  }, {
    to: 'Ana Reyes',
    match: 'Leo Kim',
    why: 'can mentor on infra'
  }, {
    to: 'Priya Nair',
    match: 'Simone Ford',
    why: 'needs a designer'
  }];
  const [queue, setQueue] = React.useState(init);
  const send = i => {
    const n = queue[i];
    setQueue(q => q.filter((_, x) => x !== i));
    onToast && onToast(`Nudge sent to ${n.to.split(' ')[0]}`);
  };
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Nudge control \xB7 private",
    right: /*#__PURE__*/React.createElement(Mono, {
      style: {
        fontSize: 11,
        color: 'var(--private)'
      }
    }, queue.length, " pending")
  }, queue.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '24px 0',
      color: 'var(--text-muted)',
      fontSize: 14
    }
  }, "No matches ready to send yet.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, queue.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surface-purple)',
      border: '1px solid var(--private-border)',
      borderRadius: 'var(--r-md)',
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(CCAvatar, {
    name: n.match,
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)'
    }
  }, n.to), " \u2192 meet ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--private)'
    }
  }, n.match), ", who ", n.why, "."), /*#__PURE__*/React.createElement(CCButton, {
    variant: "purple",
    size: "sm",
    disabled: !live,
    onClick: () => send(i)
  }, "Send")))), !live && /*#__PURE__*/React.createElement(GateNote, {
    phase: phase
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--text-faint)',
      marginTop: 14
    }
  }, "Each nudge goes to one recipient only, never to a shared view."));
}

/* Survey Monitor */
function SurveyMonitor({
  empty = false
}) {
  const rows = empty ? [] : [{
    who: 'Priya Nair',
    rating: 5,
    came: 'Collaborators'
  }, {
    who: 'Drew Ellis',
    rating: 4,
    came: 'Dealflow'
  }, {
    who: 'Tasha Boyd',
    rating: 5,
    came: 'Capital'
  }, {
    who: 'Leo Kim',
    rating: 4,
    came: 'Customers'
  }];
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Survey monitor",
    right: /*#__PURE__*/React.createElement(Mono, {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, rows.length, " in")
  }, rows.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 300,
      color: 'var(--text-muted)',
      padding: '20px 0'
    }
  }, "No responses yet.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderTop: i ? '1px solid var(--border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(CCAvatar, {
    name: r.who,
    size: 30
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 13,
      color: 'var(--text-primary)',
      fontWeight: 600
    }
  }, r.who), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--accent)',
      fontSize: 13
    }
  }, '★'.repeat(r.rating), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--border-strong)'
    }
  }, '★'.repeat(5 - r.rating))), /*#__PURE__*/React.createElement(Mono, {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)',
      width: 90,
      textAlign: 'right'
    }
  }, r.came)))));
}

/* Intelligence View */
function IntelView({
  empty = false
}) {
  if (empty) return /*#__PURE__*/React.createElement(Panel, {
    title: "The room reads"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 300,
      color: 'var(--text-muted)',
      padding: '20px 0'
    }
  }, "Not enough signal yet. Patterns appear as the room grows."));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Top offers"
  }, /*#__PURE__*/React.createElement(BarRow, {
    label: "Intros",
    value: 5,
    max: 6
  }), /*#__PURE__*/React.createElement(BarRow, {
    label: "Capital",
    value: 3,
    max: 6
  }), /*#__PURE__*/React.createElement(BarRow, {
    label: "Hiring",
    value: 3,
    max: 6
  }), /*#__PURE__*/React.createElement(BarRow, {
    label: "Feedback",
    value: 2,
    max: 6
  }), /*#__PURE__*/React.createElement(BarRow, {
    label: "Collab",
    value: 2,
    max: 6
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Top needs"
  }, /*#__PURE__*/React.createElement(BarRow, {
    label: "Customers",
    value: 4,
    max: 6,
    color: "var(--private)"
  }), /*#__PURE__*/React.createElement(BarRow, {
    label: "Engineers",
    value: 3,
    max: 6,
    color: "var(--private)"
  }), /*#__PURE__*/React.createElement(BarRow, {
    label: "Pre-seed",
    value: 3,
    max: 6,
    color: "var(--private)"
  }), /*#__PURE__*/React.createElement(BarRow, {
    label: "Partners",
    value: 2,
    max: 6,
    color: "var(--private)"
  }), /*#__PURE__*/React.createElement(BarRow, {
    label: "Co-founder",
    value: 1,
    max: 6,
    color: "var(--private)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "The room reads"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--text-primary)',
      fontWeight: 300,
      lineHeight: 1.5
    }
  }, "The room is ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600,
      color: 'var(--accent)'
    }
  }, "intro-rich"), " and ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600,
      color: 'var(--private)'
    }
  }, "customer-hungry"), ". The biggest matchable gap: three founders need pre-seed, and two investors are holding capital. Fire a nudge."))));
}
Object.assign(window, {
  RoomHost,
  SyncControl,
  ChanceControl,
  NudgeControl,
  SurveyMonitor,
  IntelView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/command-center/views.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.ContactRow = __ds_scope.ContactRow;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.EventRow = __ds_scope.EventRow;

__ds_ns.RolePill = __ds_scope.RolePill;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.CodeInput = __ds_scope.CodeInput;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ResendControl = __ds_scope.ResendControl;

__ds_ns.SegmentedToggle = __ds_scope.SegmentedToggle;

__ds_ns.Carousel = __ds_scope.Carousel;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.TabBar = __ds_scope.TabBar;

})();
