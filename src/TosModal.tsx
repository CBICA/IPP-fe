const TosModal = () => {
    return (<div id="tos" className="modal w-full">
        <div className="modal-box max-w-none w-3/4 overflow-y-scroll max-h-screen">
            <h1 className="font-extrabold text-4xl text-center">Terms of Service</h1>
            <p className="text-center mb-2">2015-08-12</p>
            <h2 className="text-2xl font-bold mb-1 mt-2">Acceptable Data</h2>
            <p>Do not upload files to the IPP containing Protected Health Information, as defined the federal Health Insurance Portability and Accountability Act (“HIPAA”), or any data that identifies research subjects individually (together, “Personally Identifiable Information” or “PII”).</p>
            <h2 className="text-2xl font-bold mb-1 mt-2">Data Use and Retention</h2>
            <ul className="list-disc list-inside">
                <li>UPHS will not be responsible for safeguarding any PII data that may be accidentally uploaded to the IPP.</li>
                <li>UPHS will not make any use of images or data uploaded to the IPP, except as necessary to provide the requested image processing services.</li>
                <li>UPHS will not store data beyond the term needed to perform the image processing as requested by the submitter.</li>
                <li>UPHS will not store results of processing beyond a short period deemed appropriate by UPHS in its sole discretion to allow such results to be downloaded.</li>
            </ul>
            <h2 className="text-2xl font-bold mb-1 mt-2">Terms of Use</h2>
            <ul className="list-disc list-inside">
                <li>The party providing data to CBICA for analysis is solely responsible for complying with any restrictions imposed by the original supplier of the data and any applicable laws and regulations, including but not limited to those governing data collection, use, and transfer.</li>
                <li>Parties submitting data to CBICA for processing agree to use all results generated by the IPP solely for non-commercial use. The term "non-commercial," as applied to use of the CBICA Image Processing Portal, means academic or other scholarly research which (a) is not undertaken for profit, or (b) is not intended to produce work, services, or data for commercial use, or (c) is neither conducted, nor funded, by a person or an entity engaged in a commercial process of medical image analysis. Academic sponsored research is not a commercial use under the terms of this Agreement.</li>
                <li>The software has been designed for research purposes only and has not been reviewed or approved by the Food and Drug Administration or by any other agency. It is not intended or recommended for clinical applications.</li>
                <li>UPHS reserves the right to cancel IPP accounts without prior notice. All data associated with cancelled accounts will be removed.</li>
                <li>Data processing through the IPP is provided on a best effort basis, with no guarantee of timely delivery.</li>
                <li>Users of the IPP agree to conspicuously acknowledge "CBICA" and the specific analysis method[s] employed through the IPP in any publications resulting from their use of the IPP.</li>
            </ul>
            <p className="mt-2">Revision 1.2, Wed Aug  12 13:04:00 EDT 2015</p>
            <div className="modal-action">
                <a href={window.location.href.split('#')[0] + "#"} className="btn btn-primary">Close</a>
            </div>
        </div>
    </div>)
};
export default TosModal;