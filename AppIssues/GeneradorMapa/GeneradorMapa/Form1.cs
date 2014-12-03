using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GeneradorMapa
{
    public partial class Form1 : Form
    {
      private string entrada;
      private Cuadricula tab_;
      private int selected_;
      private bool creado_;
      private Robot robot_;

        public Form1()
        {
            robot_ = null;
            creado_ = false;
            entrada = null;
            selected_ = -1;
            tab_ = new Cuadricula(0, 0, 0,this);
            InitializeComponent();
            this.WindowState = FormWindowState.Maximized;

        }

        private void crearToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!creado_)
            {
                Form2 f = new Form2(this);
                f.Show();
            }
            else
                MessageBox.Show("Ya se ha creado un mapa.");
        }
        private void generarToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (creado_)
            generarFichero();
        }
        public void CrearTabla()
        {
            string [] cad = entrada.Split('x');
            bool ok = true;
            try
            {
                Convert.ToInt32(cad[0]);
                Convert.ToInt32(cad[1]);
                Convert.ToInt32(cad[2]);
            }
            catch (FormatException)
            {
                ok = false;
                MessageBox.Show("Debe ser formato COLUMNASxFILASxOBSTACULOS");
            }
       
            if (ok)
            {
                tab_ = new Cuadricula(Convert.ToInt32(cad[0]), Convert.ToInt32(cad[1]), Convert.ToInt32(cad[2]),this);
                for (int i = 0; i < tab_.get_rows(); i++)
                {
                    for (int j = 0; j < tab_.get_columns(); j++)
                    {
                        this.panel.Controls.Add(this.tab_.get_Celda(i, j));
                        this.tab_.get_Celda(i, j).Click += new System.EventHandler(this.tab_.get_Celda(i, j).Celda_Click);
                    }
                }
     
                creado_ = true;
            }     
        }
        private void generarFichero()
        {
            string[] cad = entrada.Split('x');
            bool ok = false;
            List<string> texto = new List<string>();
            bool inicio = false;
            bool final = false;
            Posicion meta = new Posicion (0,0);
            texto.Add("blocks");
            texto.Add(cad[1] + "x" + cad[0]);


            for (int i = 0; i < tab_.get_rows(); i++)
            {
                for (int j = 0; j < tab_.get_columns(); j++)
                {
                    if (tab_.get_Celda(i, j).get_index() == 4)
                    {
                        if (!inicio)
                        {
                            inicio = true;
                            texto.Add(Convert.ToString(j) + "," + Convert.ToString(i));
                            robot_ = new Robot(0, 0, i, j, this);
                            ok = true;

                        }
                        else
                            ok = false;

                    }
                    else if (tab_.get_Celda(i, j).get_index() == 2)
                    {
                        if (!final)
                        {
                            final = true;
                            meta = new Posicion(i, j);
                        }
                        else
                            ok = false;
                    }
                }
            }
            if (ok)
            {
                robot_.set_meta(meta);
                generar_recorrido();
                texto.Add(robot_.get_trayectoria().get_trayectoria());
                for (int i = 0; i < tab_.get_rows(); i++)
                {
                    for (int j = 0; j < tab_.get_columns(); j++)
                    {
                        if (tab_.get_Celda(i, j).get_index() != 0 && tab_.get_Celda(i, j).get_index() != 4)
                        {
                            texto.Add(Convert.ToString(j) + "," + Convert.ToString(i) + ";" + Convert.ToString(tab_.get_Celda(i, j).get_index()));

                        }
                    }

                }




                using (System.IO.TextWriter mapa = new System.IO.StreamWriter(@"..\..\..\..\..\mapfiles\generado.map"))
                {
                    texto.ForEach(delegate(string ln)
                    {
                        mapa.WriteLine(ln);
                    });


                }
                MessageBox.Show("Mapa creado.");
            }
            else
                MessageBox.Show("El formato del mapa no es correcto.");
        }


        private void generar_recorrido()
        {
            robot_.get_method().run();
        }
        public string getent() { return entrada; }
        public void setent(string s) {  entrada = s; }
        public int get_selected() { return selected_; }
        public Cuadricula get_tab() { return tab_; }
        private void Form1_Paint(object sender, PaintEventArgs e)
        {
          
        }

     
        private void pic1_Click(object sender, EventArgs e)
        {
            this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.rock3M;
            
            switch (selected_)
            {
                case 4: this.pictureBox2.Image = global::GeneradorMapa.Properties.Resources.Inicio; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.Fin; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 1: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.rock4; break;
                default: break;
            }
            selected_ = 0;
        }
        private void pic2_Click(object sender, EventArgs e)
        {
            this.pictureBox2.Image = global::GeneradorMapa.Properties.Resources.InicioM;
            switch (selected_)
            {
                case 0: pictureBox1.Image = global::GeneradorMapa.Properties.Resources.rock3; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.Fin; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 1: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.rock4; break;
            }
            selected_ = 4;
        }
        private void pic3_Click(object sender, EventArgs e)
        {
            this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.FinM;
            switch (selected_)
            {
                case 4: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.Inicio; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.rock3; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 1: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.rock4; break;
            }
            selected_ = 2;
        }
        private void pic4_Click(object sender, EventArgs e)
        {
            this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.waterM;
            switch (selected_)
            {
                case 4: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.Inicio; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.Fin; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.rock3; break;
                case 1: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.rock4; break;
            }
            selected_ = 3;
        }
        private void pic5_Click(object sender, EventArgs e)
        {
            this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.rock4M;
            switch (selected_)
            {
                case 4: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.Inicio; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.Fin; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.rock3; break;
            }
            selected_ = 1;
        }
    }
}
