import io
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT

class CotizacionPDFGenerator:
    
    # Elegant Navy and Gold/Amber palette
    PRIMARY_COLOR = colors.HexColor('#1A2530')   # Dark Navy
    SECONDARY_COLOR = colors.HexColor('#C5A880') # Muted Gold
    TEXT_COLOR = colors.HexColor('#333333')      # Charcoal
    LIGHT_BG = colors.HexColor('#F4F6F8')        # Soft Gray
    ACCENT_BG = colors.HexColor('#FDFBF7')       # Warm Ivory
    BORDER_COLOR = colors.HexColor('#E2E8F0')    # Light Gray Border

    @classmethod
    def generate_pdf(cls, cotizacion_data: dict) -> io.BytesIO:
        """
        Generates a premium PDF document for the formal quote.
        cotizacion_data: dict containing client info, strategy breakdown, and totals.
        returns: BytesIO containing the PDF bytes.
        """
        buffer = io.BytesIO()
        
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=45
        )
        
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'QuoteTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=20,
            textColor=cls.PRIMARY_COLOR,
            leading=24
        )
        
        subtitle_style = ParagraphStyle(
            'QuoteSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            textColor=cls.SECONDARY_COLOR,
            leading=12
        )
        
        meta_label_style = ParagraphStyle(
            'MetaLabel',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            textColor=cls.PRIMARY_COLOR,
            leading=12
        )
        
        meta_value_style = ParagraphStyle(
            'MetaValue',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=cls.TEXT_COLOR,
            leading=12
        )

        section_title_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=12,
            textColor=cls.PRIMARY_COLOR,
            leading=16,
            spaceAfter=6
        )

        cell_style = ParagraphStyle(
            'TableCell',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            textColor=cls.TEXT_COLOR,
            leading=12
        )
        
        cell_bold_style = ParagraphStyle(
            'TableCellBold',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            textColor=cls.PRIMARY_COLOR,
            leading=12
        )

        cell_right_style = ParagraphStyle(
            'TableCellRight',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            textColor=cls.TEXT_COLOR,
            leading=12,
            alignment=TA_RIGHT
        )

        cell_right_bold_style = ParagraphStyle(
            'TableCellRightBold',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            textColor=cls.PRIMARY_COLOR,
            leading=12,
            alignment=TA_RIGHT
        )

        legal_text_style = ParagraphStyle(
            'LegalText',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8,
            textColor=colors.HexColor('#666666'),
            leading=11
        )

        story = []

        # 1. HEADER SECTION
        header_data = [
            [
                Paragraph("<b>TALLER DE GRANITO Y MÁRMOL</b>", title_style),
                Paragraph(f"<b>COTIZACIÓN FORMAL</b>", ParagraphStyle('RightTitle', parent=title_style, alignment=TA_RIGHT, fontSize=16))
            ],
            [
                Paragraph("Diseño y Fabricación de Cubiertas Residenciales y Comerciales", subtitle_style),
                Paragraph(f"<b>No. Cotización:</b> #{cotizacion_data.get('id', 'N/A')}", ParagraphStyle('RightSub', parent=meta_label_style, alignment=TA_RIGHT))
            ]
        ]
        header_table = Table(header_data, colWidths=[330, 200])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 15))

        # Horizontal accent bar
        bar_data = [['', '']]
        bar_table = Table(bar_data, colWidths=[380, 150], rowHeights=[3])
        bar_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), cls.PRIMARY_COLOR),
            ('BACKGROUND', (1,0), (1,0), cls.SECONDARY_COLOR),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(bar_table)
        story.append(Spacer(1, 15))

        # 2. METADATA SECTION
        fecha_emision = datetime.strptime(cotizacion_data.get('fecha', datetime.now().isoformat()[:10]), "%Y-%m-%dT%H:%M:%S.%f" if '.' in cotizacion_data.get('fecha', '') else "%Y-%m-%dT%H:%M:%S" if 'T' in cotizacion_data.get('fecha', '') else "%Y-%m-%d")
        fecha_vencimiento = fecha_emision + timedelta(days=15)
        
        client_info = cotizacion_data.get('cliente', {})
        
        meta_data = [
            [
                Paragraph("<b>INFORMACIÓN DEL CLIENTE</b>", section_title_style),
                Paragraph("<b>DETALLES DE LA COTIZACIÓN</b>", section_title_style)
            ],
            [
                Paragraph(f"<b>Nombre:</b> {client_info.get('nombre', 'N/A')}", meta_value_style),
                Paragraph(f"<b>Fecha Emisión:</b> {fecha_emision.strftime('%d/%m/%Y')}", meta_value_style)
            ],
            [
                Paragraph(f"<b>Email:</b> {client_info.get('email', 'N/A')}", meta_value_style),
                Paragraph(f"<b>Fecha Vencimiento:</b> {fecha_vencimiento.strftime('%d/%m/%Y')}", meta_value_style)
            ],
            [
                Paragraph(f"<b>Teléfono:</b> {client_info.get('telefono', 'N/A')}", meta_value_style),
                Paragraph(f"<b>Moneda:</b> Pesos Mexicanos (MXN)", meta_value_style)
            ],
            [
                Paragraph(f"<b>Dirección:</b> {client_info.get('direccion', 'N/A')}", meta_value_style),
                Paragraph(f"<b>Método de Pago:</b> Transferencia / Efectivo", meta_value_style)
            ]
        ]
        
        meta_table = Table(meta_data, colWidths=[280, 250])
        meta_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 20))

        # 3. PROJECT DETAIL
        project_details_data = [
            [
                Paragraph(f"<b>Tipo de Proyecto:</b> {cotizacion_data.get('tipo_proyecto', 'Personalizado')}", meta_label_style),
                Paragraph(f"<b>Material Seleccionado:</b> {cotizacion_data.get('material', 'N/A')}", meta_label_style)
            ]
        ]
        project_details_table = Table(project_details_data, colWidths=[265, 265])
        project_details_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), cls.LIGHT_BG),
            ('PADDING', (0,0), (-1,-1), 8),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LINEBELOW', (0,0), (-1,-1), 1.5, cls.SECONDARY_COLOR),
        ]))
        story.append(project_details_table)
        story.append(Spacer(1, 15))

        # 4. ITEMIZED CONCEPTS TABLE
        table_data = [[
            Paragraph("<b>Concepto</b>", ParagraphStyle('Th', parent=cell_bold_style, textColor=colors.white)),
            Paragraph("<b>Cant.</b>", ParagraphStyle('Th', parent=cell_bold_style, textColor=colors.white, alignment=TA_CENTER)),
            Paragraph("<b>Unidad</b>", ParagraphStyle('Th', parent=cell_bold_style, textColor=colors.white, alignment=TA_CENTER)),
            Paragraph("<b>P. Unitario</b>", ParagraphStyle('Th', parent=cell_bold_style, textColor=colors.white, alignment=TA_RIGHT)),
            Paragraph("<b>Total</b>", ParagraphStyle('Th', parent=cell_bold_style, textColor=colors.white, alignment=TA_RIGHT))
        ]]

        for item in cotizacion_data.get('items', []):
            table_data.append([
                Paragraph(item.get('concepto', ''), cell_style),
                Paragraph(f"{item.get('cantidad', 0):.2f}" if isinstance(item.get('cantidad'), float) else str(item.get('cantidad', 0)), ParagraphStyle('Tc', parent=cell_style, alignment=TA_CENTER)),
                Paragraph(item.get('unidad', ''), ParagraphStyle('Tc', parent=cell_style, alignment=TA_CENTER)),
                Paragraph(f"${item.get('precio_unitario', 0):,.2f}", cell_right_style),
                Paragraph(f"${item.get('total', 0):,.2f}", cell_right_style)
            ])

        concepts_table = Table(table_data, colWidths=[280, 50, 50, 75, 75])
        
        table_style = [
            ('BACKGROUND', (0,0), (-1,0), cls.PRIMARY_COLOR),
            ('ALIGN', (0,0), (-1,0), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, cls.BORDER_COLOR),
        ]
        for i in range(1, len(table_data)):
            if i % 2 == 0:
                table_style.append(('BACKGROUND', (0, i), (-1, i), cls.LIGHT_BG))
        
        concepts_table.setStyle(TableStyle(table_style))
        story.append(concepts_table)
        story.append(Spacer(1, 15))
        # 4.5 FINANCIAL COST & BUDGET ANALYSIS
        params = cotizacion_data.get('parametros', {})
        presupuesto = float(params.get('presupuesto', 0) or 0)
        
        # Calculate Material Cost vs Labor Cost dynamically from items
        material_keywords = ['suministro', 'material', 'zoclo']
        labor_keywords = ['instalación', 'colocación', 'corte', 'pulido', 'acabado', 'borde', 'mano de obra', 'lavabo', 'estufa', 'tarja', 'faldón', 'grapas', 'adhesivo']
        
        costo_materiales_total = 0.0
        costo_mano_obra_total = 0.0
        
        for item in cotizacion_data.get('items', []):
            concepto_lower = item.get('concepto', '').lower()
            item_total = float(item.get('total', 0))
            
            # Check if matches material keywords
            is_material = any(kw in concepto_lower for kw in material_keywords)
            is_labor = any(kw in concepto_lower for kw in labor_keywords)
            
            if is_material and not is_labor:
                costo_materiales_total += item_total
            elif is_labor:
                costo_mano_obra_total += item_total
            else:
                if 'material' in concepto_lower:
                    costo_materiales_total += item_total
                else:
                    costo_mano_obra_total += item_total

        indicators_data = [
            [
                Paragraph("<b>DESGLOSE INTERNO DE COSTOS</b>", section_title_style),
                ""
            ],
            [
                Paragraph(f"<b>Costo de Materiales:</b> ${costo_materiales_total:,.2f}", meta_value_style),
                Paragraph(f"<b>Costo de Mano de Obra:</b> ${costo_mano_obra_total:,.2f}", meta_value_style)
            ]
        ]
        
        if presupuesto > 0:
            diferencia = presupuesto - cotizacion_data.get('total', 0)
            color_str = '#16A34A' if diferencia >= 0 else '#DC2626'
            margin_text = f"<font color='{color_str}'><b>${diferencia:,.2f}</b></font>"
            indicators_data.append([
                Paragraph(f"<b>Presupuesto del Cliente:</b> ${presupuesto:,.2f}", meta_value_style),
                Paragraph(f"<b>Diferencia / Margen:</b> {margin_text}", meta_value_style)
            ])
            
        indicators_table = Table(indicators_data, colWidths=[265, 265])
        indicators_table.setStyle(TableStyle([
            ('SPAN', (0,0), (1,0)),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BACKGROUND', (0,0), (-1,-1), cls.ACCENT_BG),
            ('BOX', (0,0), (-1,-1), 0.5, cls.BORDER_COLOR),
            ('LINEBELOW', (0,0), (-1,0), 1, cls.SECONDARY_COLOR),
        ]))
        story.append(indicators_table)
        story.append(Spacer(1, 15))

        # 5. TOTALS SECTION
        totals_data = [
            [
                '',
                Paragraph("<b>Subtotal:</b>", cell_right_style),
                Paragraph(f"${cotizacion_data.get('subtotal', 0):,.2f}", cell_right_style)
            ],
            [
                '',
                Paragraph("<b>IVA (16%):</b>", cell_right_style),
                Paragraph(f"${cotizacion_data.get('iva', 0):,.2f}", cell_right_style)
            ],
            [
                '',
                Paragraph("<b>Total General:</b>", cell_right_bold_style),
                Paragraph(f"<b>${cotizacion_data.get('total', 0):,.2f}</b>", ParagraphStyle('TotVal', parent=cell_right_bold_style, textColor=cls.PRIMARY_COLOR, fontSize=11))
            ]
        ]
        
        totals_table = Table(totals_data, colWidths=[330, 100, 100])
        totals_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BACKGROUND', (1,2), (2,2), cls.ACCENT_BG),
            ('BOX', (1,2), (2,2), 1.5, cls.SECONDARY_COLOR),
        ]))
        story.append(totals_table)
        story.append(Spacer(1, 20))

        # 6. TERMS, CONDITIONS & SIGNATURE
        legal_block = []
        legal_block.append(Paragraph("<b>Términos y Condiciones Comerciales:</b>", section_title_style))
        legal_block.append(Paragraph("1. La validez de esta cotización es de 15 días naturales a partir de la fecha de emisión.", legal_text_style))
        legal_block.append(Paragraph("2. Condiciones de Pago: 50% de anticipo al firmar conformidad, 50% restante contra entrega e instalación definitiva.", legal_text_style))
        legal_block.append(Paragraph("3. Tiempo de entrega: 10 a 15 días hábiles a partir de la recepción del anticipo y la confirmación final de medidas en sitio.", legal_text_style))
        legal_block.append(Paragraph("4. No se incluyen trabajos de plomería, electricidad ni carpintería ajenos a la colocación de las piezas de piedra.", legal_text_style))
        legal_block.append(Paragraph("5. El tono y las vetas de la piedra natural (mármol/granito) son variables inherentes al material y no constituyen motivo de reclamación.", legal_text_style))
        
        legal_block.append(Spacer(1, 35))

        sig_data = [
            [
                Paragraph("<font color='#666666'>_____________________________________</font><br/><b>Firma de Conformidad (Cliente)</b>", ParagraphStyle('Sig', parent=meta_value_style, alignment=TA_CENTER)),
                Paragraph("<font color='#666666'>_____________________________________</font><br/><b>Taller de Granito y Mármol</b>", ParagraphStyle('Sig2', parent=meta_value_style, alignment=TA_CENTER))
            ]
        ]
        sig_table = Table(sig_data, colWidths=[265, 265])
        sig_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        legal_block.append(sig_table)

        story.append(KeepTogether(legal_block))

        def add_page_decorations(canvas, document):
            canvas.saveState()
            
            canvas.setFillColor(cls.PRIMARY_COLOR)
            canvas.rect(40, 770, 532, 8, fill=True, stroke=False)
            
            canvas.setFillColor(cls.SECONDARY_COLOR)
            canvas.rect(40, 767, 532, 3, fill=True, stroke=False)
            
            canvas.setFillColor(cls.BORDER_COLOR)
            canvas.rect(40, 45, 532, 1, fill=True, stroke=False)
            
            canvas.setFont('Helvetica', 8)
            canvas.setFillColor(colors.HexColor('#666666'))
            canvas.drawString(40, 32, "Taller de Granito y Mármol S.A. de C.V. | Licencia No. GTM-2026-MX")
            canvas.drawRightString(572, 32, f"Página {document.page}")
            
            canvas.restoreState()

        doc.build(story, onFirstPage=add_page_decorations, onLaterPages=add_page_decorations)
        
        buffer.seek(0)
        return buffer
