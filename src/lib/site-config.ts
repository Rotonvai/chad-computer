// Edit these to update contact details site-wide.
export const SITE = {
  name: "Chad Computer",
  tagline: "Chad Computer Coaching Center",
  phone: "+8801717199800",
  whatsapp: "+8801717199800", // digits only, with country code
  email: "chandcomputer@gmail.com",
  address: "4th floor, Agrani Bank building, singair, manikgonj",
  icon: "/favicon.svg",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1144.2214070636373!2d90.14546286963278!3d23.814970225579636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755f2795168ce8b%3A0x5150f6d62e11a347!2sAgrani%20Bank!5e1!3m2!1sen!2sbd!4v1777978389701!5m2!1sen!2sbd\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"",
};

export const waLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
