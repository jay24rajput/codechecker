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
from ..output_parser import BaseParser, Message
LOG = logging.getLogger('ReportConverter')

class CoccinelleParser(BaseParser):
    """
    Parser for Coccinelle Output
    """
    def __init__(self):
        super(CoccinelleParser, self).__init__()

        self.message_line_re = re.compile(
            # File path followed by a ':'.
            r'^(?P<path>[\S ]+?):'
            # Line number followed by a ':'.
            r'(?P<line>\d+?):'
            # Message.
            r'(?P<message>[\S \t]+)\s*')

        # Open a sample coccicheck output file

    def parse_message(self):
        f = open('codechecker_report_converter/coccinelle/kernel-output.txt', 'r')
        message_list = []

        for line in f.readlines():
            match = self.message_line_re.match(line)
            if match:
                # print(match.group('message'))
                message = Message(
                    os.path.abspath(match.group('path')),
                    int(match.group('line')),
                    0,
                    match.group('message').strip(),
                    None)
                message_list.append(message)

        return message_list

ccp = CoccinelleParser()
messages = ccp.parse_message()