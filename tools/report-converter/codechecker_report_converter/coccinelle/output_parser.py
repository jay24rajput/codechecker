# -------------------------------------------------------------------------
#
#  Part of the CodeChecker project, under the Apache License v2.0 with
#  LLVM Exceptions. See LICENSE for license information.
#  SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
#
# -------------------------------------------------------------------------


"""
Command to run the prototype:
cd ~/codechecker/tools/report-converter
python3 -m codechecker_report_converter.coccinelle.output_parser
"""

import logging
import os
import re

# from ..output_parser import Message, BaseParser
# from codechecker.tools.report-converter.codechecker_report_converter.output_parser import Message,BaseParser
from ..output_parser import BaseParser
LOG = logging.getLogger('ReportConverter')

class CoccinelleParser(BaseParser):
    """
    Parser for Coccinelle Output
    """
    def parse_coccinelle(self):

        self.message_line_re = re.compile(
            # File path followed by a ':'.
            r'^(?P<path>[\S ]+?):'
            # Line number followed by a ':'.
            r'(?P<line>\d+?):'
            # Message.
            r'(?P<message>[\S \t]+)\s*')

        # Open a sample coccicheck output file
        f = open('codechecker_report_converter/coccinelle/kernel-output.txt', 'r')
        match_list = []

        for line in f.readlines():
            match = self.message_line_re.match(line)
            if match:
                print(match.group('message'))

ccp = CoccinelleParser()
ccp.parse_coccinelle()