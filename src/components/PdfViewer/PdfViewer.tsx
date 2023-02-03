import React, { useEffect, useState } from "react";
import Alert, { AlertType } from "../Alert/Alert";

export const isEmptyOrSpaces = (str: string): boolean => {
  return str === null || str.match(/^ *$/) !== null;
};

type PdfViewerProps = {
  file_url: string;
  class_name: string;
  frame_title: string;
  setLoadingFile: (state: boolean) => void;
  full_height?: boolean;
};

const PdfViewer: React.FC<PdfViewerProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ element: string; msg: string } | null>(
    null
  );
  useEffect(() => {
    if (loading) {
      if (isEmptyOrSpaces(props.file_url)) {
        setError({ element: "PDF_FILE", msg: "File url is required" });
      } else if (error !== null) {
        setError(null);
      }
      setLoading(false);
    }
  }, [error, loading, props.file_url]);

  return (
    <div className="w-full">
      {error ? (
        <Alert
          title={error.msg}
          alertType={AlertType.DANGER}
          close={() => {}}
        />
      ) : (
        <>
          <object
            data={props.file_url}
            type="application/pdf"
            className={props.class_name}
            onLoad={() => props.setLoadingFile(false)}
          >
            <iframe
              // src={props.file_url}
              // src={
              //   "https://tmis.reb.rw/api/public/documents/1660952180_21100318066_disabilitydocs.pdf"
              // }
              src={`https://docs.google.com/viewer?url=${props.file_url}&embedded=true`}
              className={props.class_name}
              title={props.frame_title}
              onLoad={() => props.setLoadingFile(false)}
              loading={"eager"}
            >
              {/* <div className="text-2xl opacity-50">
            This browser does not support PDF!
          </div> */}
            </iframe>
          </object>
        </>
      )}
    </div>
  );
};

export default PdfViewer;
