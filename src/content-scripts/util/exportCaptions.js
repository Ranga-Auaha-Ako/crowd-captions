import * as docx from "docx";
import { saveAs } from "file-saver";

export default ({ captions, lectureName, lectureID }, bestEdit) => {
  console.log("Exporting captions...");
  // Could potentially get the sections from the DOM, but that's a bit more complicated
  // const deliveryState = document.querySelector("#viewerBridge")._reactRootContainer._internalRoot.current.child.child.memoizedState.delivery;
  // Style for having no borders:
  const noBorder = { style: docx.BorderStyle.NONE, size: 0, color: "FFFFFF" };
  //   Start by creating the rows
  const rows = captions.map((caption) => {
    // One col for the caption, one col for the notes
    const timeCol = new docx.TableCell({
      children: [
        new docx.Paragraph({
          children: [
            // Hyperlink to lecture at specified time
            new docx.ExternalHyperlink({
              children: [
                new docx.TextRun({
                  text: new Date(caption.start).toISOString().substr(14, 5),
                  style: "Hyperlink",
                }),
              ],
              link: `https://${
                window.location.host
              }/Panopto/Pages/Viewer.aspx?id=${lectureID}&start=${Math.floor(
                caption.start / 1000
              )}`,
            }),
          ],
        }),
      ],
      width: {
        size: 7,
        type: docx.WidthType.PERCENTAGE,
      },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
      },
    });
    const captionCol = new docx.TableCell({
      children: [new docx.Paragraph(bestEdit(caption))],
      width: {
        size: 35,
        type: docx.WidthType.PERCENTAGE,
      },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: { style: docx.BorderStyle.DASHED },
      },
    });
    const noteCol = new docx.TableCell({
      children: [new docx.Paragraph("")],
      width: {
        size: 70,
        type: docx.WidthType.PERCENTAGE,
      },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: { style: docx.BorderStyle.DASHED },
        right: noBorder,
      },
    });
    // Create the row
    return new docx.TableRow({ children: [timeCol, captionCol, noteCol] });
  });
  // Add the rows to the table
  const table = new docx.Table({
    rows,
    width: {
      size: 100,
      type: docx.WidthType.PERCENTAGE,
    },
  });
  const doc = new docx.Document({
    sections: [
      {
        headers: {
          default: new docx.Header({
            children: [new docx.Paragraph(lectureName)],
          }),
        },
        children: [table],
      },
    ],
    creator: "Crowd Captions",
    styles: {
      default: {},
    },
  });

  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, `${lectureName}.docx`);
    console.log("Document created successfully");
  });
};
