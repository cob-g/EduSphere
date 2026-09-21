// Static imports of every raster the page shows, in one place.
//
// Importing (rather than pointing next/image at a "/brand/…" path) makes the
// build fingerprint each file. The optimised variants are then served as
// immutable: a returning visitor re-requests nothing, and replacing a file
// changes its URL so nobody is left with a stale copy. With a plain path the
// browser re-checked every image once a day, and the server re-encoded each
// size daily for nothing.
//
// The files stay in public/ because a few things need them at fixed URLs too:
// the Organization logo in the structured data and the icon / share-image
// generators in scripts/.
import markBlack from "../../../public/brand/edusphere-mark-black.png";
import markWhite from "../../../public/brand/edusphere-mark-white.png";
import stepUpload from "../../../public/product/step-1-upload.jpg";
import stepUnderstands from "../../../public/product/step-2-ai-understands.jpg";
import stepApproves from "../../../public/product/step-3-teacher-approves.jpg";
import stepOneRecord from "../../../public/product/step-4-one-record.jpg";

export { markBlack, markWhite, stepUpload, stepUnderstands, stepApproves, stepOneRecord };
