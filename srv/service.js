const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

module.exports = cds.service.impl((srv) => {

    srv.on('getStreamCPI', async (req) => {
        const { docId } = req.data;
        
        if (!docId) {
            return req.error(400, 'Document ID is required');
        }
        
        try {
            const response = await executeHttpRequest(
                { destinationName: 'CPI_DEV_DMS' },
                {
                    method: 'GET',
                    params: {   
                        doc_id: docId
                    },
                    responseType: 'arraybuffer'
                }
            );
            
            const buffer = Buffer.isBuffer(response.data) 
                ? response.data 
                : Buffer.from(response.data);
            
            req._.res.set('Content-Type', 'application/pdf');
            req._.res.set('Content-Disposition', 'inline; filename="document.pdf"');
            req._.res.send(buffer);
            
        } catch (error) {
            console.error('CPI request failed:', error.message);
            return req.error(500, 'Failed to retrieve document from CPI');
        }
    });

});
